from pydantic import BaseModel
from typing import Optional, List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import joinedload

from api.deps import db_dependency, user_dependency
from api.models import Routine, Workout


router = APIRouter(prefix="/routines", tags=["routines"])


class RoutineBase(BaseModel):
    name: str
    description: Optional[str] = None


class RoutineCreate(RoutineBase):
    workouts: List[int] = []


@router.get("/")
async def get_routines(db: db_dependency, user: user_dependency):
    return (
        db.query(Routine)
        .options(joinedload(Routine.workouts))
        .filter(Routine.user_id == user.get("id"))
        .all()
    )


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_routine(
    db: db_dependency, user: user_dependency, routine_request: RoutineCreate
):
    new_routine = Routine(
        name=routine_request.name,
        description=routine_request.description,
        user_id=user.get("id"),
    )
    for workout_id in routine_request.workouts:
        workout = db.query(Workout).filter(Workout.id == workout_id).first()
        if workout:
            new_routine.workouts.append(workout)

    db.add(new_routine)
    db.commit()
    db.refresh(new_routine)
    db_routines = (
        db.query(Routine)
        .options(joinedload(Routine.workouts))
        .filter(Routine.id == new_routine.id)
        .first()
    )
    return db_routines


@router.delete("/")
async def delete_routine(db: db_dependency, user: user_dependency, routine_id: int):
    routine_to_delete = db.query(Routine).filter(Routine.id == routine_id).first()
    if routine_to_delete:
        db.delete(routine_to_delete)
        db.commit()
    return routine_to_delete
