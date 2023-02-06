import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from "react";
import PipelineSelectMenu from "./PipelineSelectMenu";

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

export default function PipelineForm() {
    const [selectedPipeline, SetSelectedPipeline] = useState({} as any)
    const [schema, setSchema] = useState(null);

    // const { register, handleSubmit } = useForm({
    //     resolver: yupResolver(schema),
    //     mode: "all"
    // });

    // const onSubmit = (data: any) => {
    //     console.log(Object.keys(data))
    // };

    return (
        <>
            <PipelineSelectMenu
                selectedPipeline={selectedPipeline}
                SetSelectedPipeline={SetSelectedPipeline}
            />
            {/* <form onSubmit={handleSubmit(onSubmit)}>
                <input defaultValue="test" {...register("example")} />
                <input {...register("exampleRequired", { required: true })} />
                <input type="submit" />
            </form> */}
        </>
    );
}
