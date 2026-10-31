"""Dispatch router — trigger ambulance dispatch for an emergency."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import require_role, get_current_user
from app.database.connection import get_db
from app.database import models
from app.schemas.dispatch import DispatchResult, AssignmentUpdate
from app.services import dispatch_service

router = APIRouter()


@router.post("/emergency/{request_id}", response_model=DispatchResult)
def dispatch_for_emergency(
    request_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role("admin", "hospital_staff")),
):
    """
    Dispatch the best available ambulance for the given emergency request.
    Uses ETA-based ranking.
    """
    req = db.query(models.EmergencyRequest).filter(models.EmergencyRequest.request_id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Emergency request not found")
    if req.status not in ("pending", "dispatched"):
        raise HTTPException(status_code=400, detail=f"Cannot dispatch: request is '{req.status}'")

    assignment = dispatch_service.dispatch_ambulance(db, req)
    if not assignment:
        raise HTTPException(status_code=503, detail="No available ambulances at this time")

    return DispatchResult(
        assignment_id=assignment.assignment_id,
        request_id=assignment.request_id,
        ambulance_id=assignment.ambulance_id,
        driver_id=assignment.driver_id,
        estimated_arrival_seconds=assignment.estimated_arrival_seconds,
        status=assignment.status,
        assigned_at=assignment.assigned_at,
        message="Ambulance dispatched successfully",
    )


@router.get("/assignments", response_model=List[dict])
def list_assignments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """List dispatch assignments — filtered by role."""
    q = db.query(models.DispatchAssignment)
    if current_user.role == "driver" and current_user.driver:
        q = q.filter(models.DispatchAssignment.driver_id == current_user.driver.driver_id)
    assignments = q.order_by(models.DispatchAssignment.assigned_at.desc()).limit(50).all()
    return [
        {
            "assignment_id": a.assignment_id,
            "request_id": a.request_id,
            "ambulance_id": a.ambulance_id,
            "driver_id": a.driver_id,
            "status": a.status,
            "estimated_arrival_seconds": a.estimated_arrival_seconds,
            "assigned_at": a.assigned_at,
        }
        for a in assignments
    ]


@router.patch("/assignments/{assignment_id}", response_model=dict)
def update_assignment(
    assignment_id: int,
    payload: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Driver accepts or rejects an assignment."""
    assignment = db.query(models.DispatchAssignment).filter(
        models.DispatchAssignment.assignment_id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Drivers can only update their own assignments
    if current_user.role == "driver":
        if not current_user.driver or assignment.driver_id != current_user.driver.driver_id:
            raise HTTPException(status_code=403, detail="Access denied")

    if payload.status == "rejected":
        dispatch_service.cancel_assignment(db, assignment_id, reason=payload.rejection_reason or "")
    else:
        assignment.status = payload.status
        if payload.notes:
            assignment.notes = payload.notes
        db.commit()

    db.refresh(assignment)
    return {"assignment_id": assignment.assignment_id, "status": assignment.status}

