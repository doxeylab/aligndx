import { useState } from "react"
import SelectMenu from "../../SelectMenu"
import usePipelineMeta from "./usePipelineMeta"

interface PipelineSelectProps {
    selectedPipeline: any;
    SetSelectedPipeline: any;
}

export default function PipelineSelect({selectedPipeline, SetSelectedPipeline} : PipelineSelectProps) {
    const [options, setOptions] = useState([] as any)

    const onSuccess = (data: any) => {
        setOptions(data)
    }
    const onError = (err: any) => {
        setOptions([])
    }
    const pipemeta = usePipelineMeta(onSuccess, onError)

    return (
        <SelectMenu
            label="Select a pipeline"
            options={options}
            groupBy={(option: any) => option.categories}
            onChange={(event : any, newInputValue :any) => {
                SetSelectedPipeline(newInputValue);
            }}
            getOptionLabel={(option: any) => {
                if (option.length != 0) {
                    return option.title
                }
                else {
                    return ''
                }
            }}
            isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
        />
    )
}
