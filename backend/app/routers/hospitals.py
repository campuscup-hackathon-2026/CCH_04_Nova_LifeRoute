"""Hospitals router."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.connection import get_db
from app.database import models
from app.schemas.hospital import HospitalOut, HospitalRecommendationOut
from app.services import hospital_service

router = APIRouter()


@router.get("/", response_model=List[HospitalOut])
def list_hospitals(
    active_only: bool = True,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    q = db.query(models.Hospital)
    if active_only:
        q = q.filter(models.Hospital.is_active == True)
    return q.all()


@router.get("/{hospital_id}", response_model=HospitalOut)
def get_hospital(hospital_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    h = db.query(models.Hospital).filter(models.Hospital.hospital_id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return h


@router.post("/recommend/{request_id}", response_model=List[HospitalRecommendationOut])
def recommend_hospitals(
    request_id: int,
    required_service: Optional[str] = Query(None),
    need_icu: bool = Query(False),
    top_n: int = Query(5, le=10),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """
    Recommend hospitals for an emergency request.
    [DECISION SUPPORT ONLY — not clinical triage]
    """
    req = db.query(models.EmergencyRequest).filter(models.EmergencyRequest.request_id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    recs = hospital_service.recommend_hospitals(db, req, required_service=required_service, need_icu=need_icu, top_n=top_n)
    return recs


@router.get("/{hospital_id}/services")
def get_hospital_services(hospital_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    h = db.query(models.Hospital).filter(models.Hospital.hospital_id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return [{"service_id": s.service_id, "service_name": s.service_name, "is_available": s.is_available} for s in h.services]


@router.patch("/{hospital_id}/verify", dependencies=[Depends(require_role("admin"))])
def verify_hospital(hospital_id: int, db: Session = Depends(get_db)):
    h = db.query(models.Hospital).filter(models.Hospital.hospital_id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    h.is_verified = True
    db.commit()
    return {"message": f"Hospital {hospital_id} verified"}

