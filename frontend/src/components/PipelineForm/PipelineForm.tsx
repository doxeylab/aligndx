import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { useState, useEffect } from "react";

export default function PipelineForm() {
    const [schema, setSchema] = useState(null);

    const { register, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        mode: "all"
    });

    const onSubmit = (data: any) => {
        console.log(Object.keys(data))
    };

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <input defaultValue="test" {...register("example")} />

            <input {...register("exampleRequired", { required: true })} />

            <input type="submit" />
        </form>
    );
}
