import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useQuery } from '@tanstack/react-query'
import { useWorkflows } from '../../api/Workflows'
import { useState } from 'react'

type WorkflowsProps = {
    id: string
    name: string
}

interface WorkflowSelectMenuProps {
    setWorkflowId: (id: string | null) => void
}

export default function WorkflowSelectMenu({
    setWorkflowId,
}: WorkflowSelectMenuProps) {
    const { get_workflows } = useWorkflows()
    const [options, setOptions] = useState([])

    const workflows = useQuery({
        queryKey: ['workflows'],
        retry: false,
        queryFn: get_workflows,
        onSuccess(data) {
            setOptions(data?.data['workflows'])
        },
        onError(err) {
            console.error(err)
        },
    })

    return (
        <Autocomplete
            autoComplete
            id="sel-menu"
            renderInput={(params: object) => (
                <TextField {...params} label="Workflow" />
            )}
            options={options}
            getOptionLabel={(workflow: WorkflowsProps) => workflow.name}
            onChange={(event, newValue) => {
                setWorkflowId(newValue ? newValue.id : null)
            }}
        />
    )
}
