from fastapi import APIRouter, HTTPException, status
from typing import List
from app.services.workflows import WorkflowOrchestrator
from app.models.workflows import WorkflowSchema

router = APIRouter()


@router.get("/")
async def get_workflows():
    """
    Get all available workflows:
    """
    orchestrator = WorkflowOrchestrator()
    try:
        available_workflows = orchestrator.get_workflows()
        return available_workflows
    except:
        HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch workflows",
        )


@router.get("/{workflow_id}", response_model=WorkflowSchema)
async def get_workflow(
    workflow_id: str,
):
    """
    Get a specific workflow:
    - **workflow_id**: The unique workflow id
    """
    orchestrator = WorkflowOrchestrator()
    try:
        schema = orchestrator.get_workflow(workflow_id=workflow_id)
        print(schema)
        return schema
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No workflow matching that ID",
        )
