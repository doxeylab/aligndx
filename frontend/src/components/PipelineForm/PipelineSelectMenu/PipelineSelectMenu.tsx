import { useState } from "react"
import SelectMenu from "../../SelectMenu"
import usePipelineMeta from "./usePipelineMeta"

interface PipelineSelectProps {
    onChange: any;
}

export default function PipelineSelect({onChange} : PipelineSelectProps) {
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
            onChange={(event : any, newInputValue :any) => {
                onChange(newInputValue);
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
