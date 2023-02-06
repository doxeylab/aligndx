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
import { Uploader } from "../Uploader";
import useRefresh from "../../api/useRefresh";

export default function PipelineForm() {
    const [selectedPipeline, SetSelectedPipeline] = useState({} as any)
    const [uploaders, setUploaders] = useState({} as any)
    const [schema, setSchema] = useState(null);

    const refresh = useRefresh();
    const onSubmit = (data: any) => {
        console.log(data)
    };

    useEffect(() => {
        if (isEmpty(selectedPipeline) == false) {
            setSchema(SchemaGenerator(selectedPipeline.inputs))
            const createUploader = (val: any) => {
                return Uploader({ id: val.id, fileTypes: val.file_types, refresh: refresh })
            }
            const fileInputs = selectedPipeline.inputs.filter((obj: any) => obj.input_type === 'file')
            const pipelineUploaders = fileInputs.reduce((o, key) => ({ ...o, [key.id]: createUploader(key) }), {})
            setUploaders({ ...pipelineUploaders })

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

                                <DynamicInputs
                                    selectedPipelineInputs={selectedPipeline.inputs}
                                    uploaders={uploaders}
                                />
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
