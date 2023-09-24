from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Response, status
from typing import List
from app.models.auth import UserDTO
from app.models.submissions import Submission
from app.services.db import get_db
from app.services.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[Submission])
async def get_submissions(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all submissions for the current user:
    """
    return Response(status_code=status.HTTP_200_OK)


@router.get("/{submission_id}", response_model=Submission)
async def get_submissions(
    submission_id: str,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific submission for a user:
    """
    pass


@router.post("/", response_model=Submission)
async def get_submissions(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific submission for a user:
    """
    pass
