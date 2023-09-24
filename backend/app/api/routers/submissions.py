from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.auth import UserDTO
from app.models.submissions import (
    SubmissionRequest,
    SubmissionResponse,
    SubmissionEntry,
)
from app.services.db import get_db
from app.services.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[SubmissionResponse])
async def get_submissions(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all submissions:
    """
    pass


@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: str,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific submission:
    - **submission_id**: The unique submission id
    """
    pass


@router.post("/", response_model=SubmissionResponse)
async def create_submission(
    submission: SubmissionRequest,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a submission:
    - **workflow_id**: The workflow for the submission
    - **name**: A name for the submission
    - **inputs**: The inputs for the submission
    """
    pass


@router.delete("/{submission_id}", response_model=SubmissionResponse)
async def delete_submission(
    submission_id: str,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a submission:
    - **submission_id**: The unique submission id
    """
    pass


@router.patch("/{submission_id}/run", response_model=SubmissionResponse)
async def run_submission(
    submission_id: str,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Runs a submission:
    - **submission_id**: A name for the submission
    """
    pass


@router.get("/{submission_id}/report")
async def get_submission(
    submission_id: str,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the submission report:
    - **submission_id**: The unique submission id
    """
    pass
