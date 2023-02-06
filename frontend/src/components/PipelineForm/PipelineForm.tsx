import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from "react";

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import SchemaGenerator from "./SchemaGenerator";
import PipelineSelectMenu from "./PipelineSelectMenu";
import isEmpty from "../../utils/isEmpty";

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

    {/* <form onSubmit={handleSubmit(onSubmit)}>
                <input defaultValue="test" {...register("example")} />
                <input {...register("exampleRequired", { required: true })} />
                <input type="submit" />
            </form> */}

    useEffect(() => {
        if (isEmpty(selectedPipeline) == false) {
            setSchema(SchemaGenerator(selectedPipeline.inputs))
        }
 
    }, [selectedPipeline])

    return (
        <Grid container spacing={3}>
            <Grid item xs={10} sm={6} md={4}>
                <Paper
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <PipelineSelectMenu
                        selectedPipeline={selectedPipeline}
                        SetSelectedPipeline={SetSelectedPipeline}
                    />
                </Paper>
            </Grid>
            {isEmpty(selectedPipeline) ?
                null
                :
                <>
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                p: 4,
                            }}
                        >
                            <Typography>Description</Typography>
                            {selectedPipeline?.description}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}
                        alignItems="center"
                        justifyContent={'center'}
                    >
                        <Paper sx={{
                            p: 2
                        }}>
                            <Grid container item xs={12} sm={9} md={6} lg={3} pb={2}
                                alignItems="center"
                            >

                                <Grid >
                                </Grid>
                            </Grid>
                            <Grid>
        
                            </Grid>
                            <Grid
                                container
                                alignContent={'center'}
                                justifyContent={'center'}
                                pt={5}
                            >
                                <Button
                                    type='submit'
                                    variant="contained"
                                >Submit</Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </>
            }
        </Grid>
    );
}
