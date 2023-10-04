/* eslint-disable */
// @ts-nocheck

import { useState, useEffect } from "react";
import { Form } from "../Form";
import {
    Paper, Grid, Button, Typography, CircularProgress
} from '@mui/material'

import SchemaGenerator from "./SchemaGenerator";
import { Uploader } from "../Uploader";
import PipelineSelectMenu from "./PipelineSelectMenu";
import DynamicInputs from "./DynamicInputs";
import Monitor from "../Monitor";
import CrossFade from "../CrossFade";
import useLocalStorage from "../../hooks/useLocalStorage";
import isEmpty from "../../utils/isEmpty";
import useSubmission from "./useSubmission";
import { refreshAccessToken } from "../../context/utils";
import { useSubmissions } from "../../api/Submissions";
import { useMutation } from "@tanstack/react-query";

export default function PipelineForm() {
    // Initialize states
    const [selectedPipeline, setSelectedPipeline] = useLocalStorage('selectedPipeline', null)
    const [uploaders, setUploaders] = useState({})
    const [schema, setSchema] = useState(null);
    const [success, setSuccess] = useState(false);
    const [subId, setSubId] = useState(null);
    const [showInputs, setShowInputs] = useState(false);
    const [readyStatus, setReadyStatus] = useState({});

    // Initialize hooks
    const submissionRunner = useSubmission('runner')
    const submissions = useSubmissions();

    const onSuccess = (data: any) => {
        const submissionID = data?.data['sub_id']
        setSubId(submissionID)
    
        for (const [inp, uploader] of Object.entries<any>(uploaders[selectedPipeline?.id])) {
            uploader.setMeta({ 'sub_id': submissionID, 'input_id': inp })
            uploader.upload()
        }
    }

    const deletefn = (data : any) => {
        submissions.del_record([data])
    }

    const deleteMutation = useMutation(['cancel_submission'], deletefn, {
        retry: false,
    })

    useEffect(() => {
        if (Object.keys(readyStatus).length > 0) {
            if (Object.values(readyStatus).every(status => status === true)) {
                submissionRunner.mutate({
                    'sub_id': subId
                })
        
                setSuccess(true);
            }
            if (Object.values(readyStatus).includes(null)){
                deleteMutation.mutate(subId)
            }
        }
    },[readyStatus])

    const submissionStarter = useSubmission('starter', onSuccess)


    const onSubmit = (data: any) => {
        const submissionData = {
            name: data['name'],
            pipeline: selectedPipeline?.id,
            inputs: data
        }
        submissionStarter.mutate(submissionData)
    };

    const createUploaders = (pipeline: any) => {
        const createUploader = (val: any) => {
            return Uploader({ id: `${pipeline.id}-${val.id}`, fileTypes: val.file_types, refresh: refreshAccessToken })
        }

        const fileInputs = pipeline.inputs.filter((obj: any) => obj.input_type === 'file')
        const inputsStatus = fileInputs.reduce((acc: any, obj: any) => {
            acc[obj.id] = false;
            return acc;
          }, {});
        setReadyStatus(inputsStatus)
        const pipelineUploaders = fileInputs.reduce((o: any, key: any) => ({ ...o, [key.id]: createUploader(key) }), {})
        return pipelineUploaders

    }

    const onPipelineChange = (value: any) => {
        if (value) {
            setSelectedPipeline(value)
        }
        else {
            setSelectedPipeline(null)
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
            setReadyStatus({})
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
                                                readyStatus={readyStatus}
                                                setReadyStatus={setReadyStatus}
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
