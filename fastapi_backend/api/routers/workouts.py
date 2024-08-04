from pydantic import BaseModel
from typing import Optional

from fastapi import APIRouter, Depends, status

from api.deps import db_dependency, user_dependency
from api.models import Workout


router = APIRouter(prefix="/workouts", tags=["workouts"])


class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None


class WorkoutCreate(WorkoutBase):
    pass


@router.get("/")
async def get_workout(db: db_dependency, user: user_dependency, workout_id: int):
    return db.query(Workout).filter(Workout.id == workout_id).first()


@router.get("/workouts")
async def get_workouts(db: db_dependency, user: user_dependency):
    return db.query(Workout).all()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_workout(
    workout_request: WorkoutCreate, db: db_dependency, user: user_dependency
):
    # new_workout = Workout(
    #     user_id=user["id"],
    #     name=workout_request.name,
    #     description=workout_request.description,
    # )
    new_workout = Workout(**workout_request.model_dump(), user_id=user.get("id"))
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    return new_workout


@router.delete("/")
async def delete_workout(db: db_dependency, user: user_dependency, workout_id: int):
    workout_to_delete = db.query(Workout).filter(Workout.id == workout_id).first()
    if workout_to_delete:
        db.delete(workout_to_delete)
        db.commit()

    return workout_to_delete
