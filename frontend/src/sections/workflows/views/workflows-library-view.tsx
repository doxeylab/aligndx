import WorkflowSelectMenu from '../workflow-select-menu'
import { useState } from 'react'

export default function WorkflowsLibraryView() {
    const [workflowId, setWorkflowId] = useState<string | null>(null)

    return (
        <>
            <WorkflowSelectMenu setWorkflowId={setWorkflowId} />
        </>
    )
}
