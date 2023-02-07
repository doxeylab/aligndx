import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { StatusBar } from '@uppy/react'
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import useWebSocket from "../../../api/Socket";
import StatusButton from "./StatusButton";
import useSubmissionStatus from './useSubmissionStatus'

export default function ProgressView({ subId, setSuccess, selectedPipeline, uploaders }) {
    const [complete, setComplete] = useState(false);
    const [data, setData] = useState({} as any);

    const methods = useFormContext()
    const { connectWebsocket } = useWebSocket();

    const dataHandler = (event: any) => {
        if (event.type == 'message') {
            const resp = JSON.parse(event.data)
            setData(resp)
        }
    }

    const onSuccess = (data: any) => {
        const status = data?.data['status']
        if (status && status != 'completed' || status != 'error') {
            connectWebsocket(subId, dataHandler)
        }
        else {
            setData(data?.data)
        }
    }

    const status = useSubmissionStatus(subId, onSuccess)

    const handleNewSubmission = () => {
        Object.entries(uploaders[selectedPipeline.id]).map(([inp, uploader]) => {
            uploader.cancelAll()
            methods.setValue(inp, null, { shouldValidate: true })
        })
        setSuccess(false)
    }

    useEffect(() => {
        if (data) {
            if (data['status'] == 'completed') {
                setComplete(true)
            }
            if (data['status'] == 'error') {
                setComplete(true)
            }
        }
    }, [data])

    return (
        <>
            <Grid container width={'100%'}>
                <Grid item xs>
                    <Paper
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                        <Box
                            display={'flex'}
                            alignItems="center"
                            justifyContent={"space-between"}
                            pb={2}
                        >
                            <Paper sx={{ backgroundColor: 'black', padding: 1 }} elevation={2}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line'}}>
                                    Run | {data?.name}
                                </Typography>
                            </Paper>
                            <StatusButton status={data['status']} />
                        </Box>
                        <Typography variant="h5" pb={1}>
                            Uploads
                        </Typography>
                        <Divider />
                        {Object.entries(uploaders[selectedPipeline?.id]).map(([inp, uploader]) => {
                            const currInp = selectedPipeline?.inputs.find(e => e.id === inp)
                            return (
                                <>
                                    <Grid py={2} key={`${selectedPipeline.id}-${inp}-uploadprogress`}>
                                        <Typography > {currInp.title} </Typography>
                                        <StatusBar
                                            uppy={uploader}
                                            hideUploadButton
                                            hideAfterFinish={false}
                                            showProgressDetails={true}
                                            hideRetryButton={true}
                                            hidePauseResumeButton={true}
                                            hideCancelButton={true}
                                        />
                                    </Grid>
                                </>
                            )
                        })}
                        <Typography variant="h5" pb={1}>
                            Analysis
                        </Typography>
                        <Divider />

                        {complete ?
                            <Grid
                                container
                                pt={4}
                                justifyContent={'center'}
                            >
                                <Button
                                    variant={'contained'}
                                    onClick={handleNewSubmission}>
                                    New Submission
                                </Button>

                            </Grid>
                            :
                            null
                        }
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}