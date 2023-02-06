import { Form } from "../Form";
import { useState, useEffect } from "react";

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import SchemaGenerator from "./SchemaGenerator";
import isEmpty from "../../utils/isEmpty";

import PipelineSelectMenu from "./PipelineSelectMenu";
import DynamicInputs from "./DynamicInputs";

export default function PipelineForm() {
    const [selectedPipeline, SetSelectedPipeline] = useState({} as any)
    const [schema, setSchema] = useState(null);

    const onSubmit = (data: any) => {
        console.log(data)
    };

    useEffect(() => {
        if (isEmpty(selectedPipeline) == false) {
            setSchema(SchemaGenerator(selectedPipeline.inputs))
        }
    }, [selectedPipeline])

    return (
        <Form
            schema={schema}
            onSubmit={onSubmit}
        >
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
                                        <DynamicInputs selectedPipelineInputs={selectedPipeline.inputs}/>
                                    </Grid>
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
        </Form>
    );
}
