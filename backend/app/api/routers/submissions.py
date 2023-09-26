import datetime, uuid
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.auth import UserDTO
from app.models.submissions import (
    SubmissionRequest,
    SubmissionResponse,
    SubmissionEntry,
    SubmissionStatus,
)
from app.models.stores import BaseStores
from app.core.db.dals.submissions import SubmissionsDal
from app.services.db import get_db
from app.services.auth import get_current_user
from app.services.storages import StorageManager
from app.celery.tasks import create_job, run_job

router = APIRouter()


@router.get("/", response_model=List[SubmissionResponse])
async def get_submissions(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all submissions:
    """
    sub_dal = SubmissionsDal(db)
    all_submissions = await sub_dal.get_all_submissions(current_user.id)
    return all_submissions


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
    sub_dal = SubmissionsDal(db)
    submission = await sub_dal.get_submission(current_user.id, submission_id)
    return submission


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
    query = await sub_dal.create(
        SubmissionEntry(
            user_id=current_user.id,
            status=SubmissionStatus.CREATED,
            created_date=datetime.datetime.now(datetime.timezone.utc).isoformat(),
            **submission.dict()
        )
    )
    sub_dal = SubmissionsDal(db)
    submission_id = str(query)

    create_job.apply_async(
        args=[
            submission_id,
            submission.workflow_id,
            submission.name,
            submission.inputs,
        ]
    )

    return submission_id


@router.delete("/{submission_id}", response_model=SubmissionResponse)
async def delete_submission(
    submission_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a submission:
    - **submission_id**: The unique submission id
    """
    sub_dal = SubmissionsDal(db)
    try:
        query = await sub_dal.delete_by_id(uuid.UUID(submission_id))
        return str(query)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Could not delete the item"
        )


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
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, submission_id)

    if query is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Submission does not exist"
        )

    run_job(submission_id)
    return str(query)


@router.get("/{submission_id}/report")
async def get_report(
    submission_id: str,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the submission report:
    - **submission_id**: The unique submission id
    """
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, submission_id)

    if query is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Submission does not exist"
        )

    storage = StorageManager(prefix=submission_id)
    report = storage.read(store=BaseStores.RESULTS, filename="report.html")
    return report
