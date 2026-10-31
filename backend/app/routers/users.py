"""Users router."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.connection import get_db
from app.database import models
from app.schemas.user import UserOut, UserUpdate

router = APIRouter()


@router.get("/", response_model=List[UserOut], dependencies=[Depends(require_role("admin"))])
def list_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.User).offset(skip).limit(limit).all()


@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role != "admin" and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", dependencies=[Depends(require_role("admin"))])
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"message": f"User {user_id} deactivated"}

