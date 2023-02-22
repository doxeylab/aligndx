import { Form } from "../Form";
import { useState, useEffect } from "react";

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import SchemaGenerator from "./SchemaGenerator";

import { Uploader } from "../Uploader";
import PipelineSelectMenu from "./PipelineSelectMenu";
import DynamicInputs from "./DynamicInputs";
import Monitor from "../Monitor";
import CrossFade from "../CrossFade";
import useRefresh from "../../api/useRefresh";
import useSubmissionStarter from "./useSubmissionStarter";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function PipelineForm() {
    const [selectedPipeline, SetSelectedPipeline] = useState({} as any)
    const [uploaders, setUploaders] = useState({} as any)
    const [schema, setSchema] = useState(null);
    const [success, setSuccess] = useLocalStorage('success', null);
    const [subId, setSubId] = useLocalStorage('subId', null);
    const [showInputs, setShowInputs] = useState(false);

    const refresh = useRefresh();

    const onSuccess = (data) => {
        const submissionID = data?.data['sub_id']
        setSubId(submissionID)
        for (const [inp, uploader] of Object.entries(uploaders[selectedPipeline.id])) {
            uploader.setMeta({ 'sub_id': submissionID, 'input_id': inp })
            uploader.upload()
        }
        setSuccess(true);
    }
    const submissionStarter = useSubmissionStarter(onSuccess)

    const onSubmit = (data: any) => {
        const inputs = [] as any
        selectedPipeline.inputs.forEach((inp: object) => {
            if (inp.input_type == 'select') {
                if (typeof (data[inp.id]) != 'object') {
                    inp['values'] = [data[inp.id]]
                }
                else {
                    inp['values'] = data[inp.id]
                }
            }
            else {
                inp['values'] = data[inp.id]
            }
            inputs.push(inp)
        })

        let submissionData = {
            name: data['name'],
            pipeline: selectedPipeline.id,
            inputs: inputs
        }
        submissionStarter.mutate(submissionData)
    };

    const createUploaders = (pipeline: any) => {
        const createUploader = (val: any) => {
            return Uploader({ id: `${pipeline.id}-${val.id}`, fileTypes: val.file_types, refresh: refresh })
        }

        const fileInputs = pipeline.inputs.filter((obj: any) => obj.input_type === 'file')
        const pipelineUploaders = fileInputs.reduce((o, key) => ({ ...o, [key.id]: createUploader(key) }), {})
        return pipelineUploaders

    }

    const onPipelineChange = (value: any) => {
        if (value) {
            SetSelectedPipeline(value)
            setSchema(SchemaGenerator(value.inputs))
            const pipelineUploaders = createUploaders(value)
            setUploaders({ ...uploaders, [value.id]: { ...pipelineUploaders } })
            setShowInputs(true)
        }
        else {
            for (const [inp, uploader] of Object.entries(uploaders[selectedPipeline.id])) {
                uploader.close()
                uploader.cancelAll()
            }
            setUploaders({})
            setShowInputs(false)
        }
    }

    const handleNew = () =>{
        setSuccess(false)
        for (const [inp, uploader] of Object.entries(uploaders[selectedPipeline.id])) {
            uploader.cancelAll()
        }
    }


    return (
        <>
            <Grid container mb={3} spacing={3}>
                <Grid item xs={10} sm={6} md={4}>
                    <Paper
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <PipelineSelectMenu
                            onChange={onPipelineChange}
                        />
                    </Paper>
                </Grid>
                {showInputs ?
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
                    :
                    null
                }
                <Grid item xs={12}>
                    <CrossFade
                        components={[{
                            in: success,
                            component: <>
                                {showInputs ?
                                    <Monitor handleNew={handleNew} selectedPipeline={selectedPipeline} subId={subId} uploaders={uploaders} />
                                    :
                                    null
                                }
                            </>
                        },
                        {
                            in: success == false,
                            component: <>
                                {showInputs ?
                                    <Form
                                        key={selectedPipeline?.id}
                                        schema={schema}
                                        onSubmit={onSubmit}
                                    >
                                        <Grid container width={'100%'}>

                                            <Grid item xs={12}
                                                alignItems="center"
                                                justifyContent={'center'}
                                            >
                                                <Paper sx={{
                                                    p: 2
                                                }}>

                                                    <DynamicInputs
                                                        selectedPipeline={selectedPipeline}
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
                                        </Grid>
                                    </Form>
                                    :
                                    null
                                }
                            </>
                        },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
