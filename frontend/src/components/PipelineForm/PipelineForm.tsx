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
import isEmpty from "../../utils/isEmpty";
import { CircularProgress } from "@mui/material";


export default function PipelineForm() {
    const [selectedPipeline, SetSelectedPipeline] = useLocalStorage('selectedPipeline', {} as any)
    const [uploaders, setUploaders] = useState({} as any)
    const [schema, setSchema] = useState(null as any);
    const [success, setSuccess] = useLocalStorage<any>('success', null);
    const [subId, setSubId] = useLocalStorage('subId', null);
    const [showInputs, setShowInputs] = useState(false);

    const refresh = useRefresh();

    const onSuccess = (data : any) => {
        const submissionID = data?.data['sub_id']
        setSubId(submissionID)
        for (const [inp, uploader] of Object.entries<any>(uploaders[selectedPipeline.id])) {
            uploader.setMeta({ 'sub_id': submissionID, 'input_id': inp })
            uploader.upload()
        }
        setSuccess(true);
    }
    const submissionStarter = useSubmissionStarter(onSuccess)

    const onSubmit = (data: any) => {
        const inputs = [] as any
        selectedPipeline.inputs.forEach((inp: any) => {
            if (inp['input_type'] == 'select') {
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

        const submissionData = {
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
        const pipelineUploaders = fileInputs.reduce((o: any, key: any) => ({ ...o, [key.id]: createUploader(key) }), {})
        return pipelineUploaders

    }

    const onPipelineChange = (value: any) => {
        if (value) {
            SetSelectedPipeline(value)
        }
        else {
            SetSelectedPipeline(null)
        }
    }

    const handleNew = () => {
        setSuccess(false)
        for (const [inp, uploader] of Object.entries<any>(uploaders[selectedPipeline.id])) {
            uploader.cancelAll()
        }
    }

    useEffect(() => {
        if (isEmpty(selectedPipeline) == false) {
            setSchema(SchemaGenerator(selectedPipeline.inputs))
            const pipelineUploaders = createUploaders(selectedPipeline)
            setUploaders({ ...uploaders, [selectedPipeline.id]: { ...pipelineUploaders } })
            setShowInputs(true)
        }
        else {
            setUploaders({})
            setShowInputs(false)
        }

    }, [selectedPipeline])

    return (
        <>
            <CrossFade
                components={[{
                    in: success == true,
                    component: <>
                        {showInputs ?
                            <Monitor handleNew={handleNew} selectedPipeline={selectedPipeline} subId={subId} uploaders={uploaders} />
                            :
                            null}
                    </>,
                },
                {
                    in: success != true,
                    component: <>
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
                        </Grid>
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
                                                >
                                                    {submissionStarter.isLoading ? <CircularProgress size={25} /> : 'Submit'}

                                                </Button>
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
        </>
    );
}
