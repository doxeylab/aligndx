import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { StatusBar } from '@uppy/react'
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import useWebSocket from "../../../api/Socket";
import StatusButton from "./StatusButton";
import useSubmissionStatus from './useSubmissionStatus'

export default function ProgressView({ subId, setSuccess, uploaders }) {
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
        if (status && status != 'completed') {
            connectWebsocket(subId, dataHandler)
        }
        else {
            setData(data?.data)
        }
    }

    const status = useSubmissionStatus(subId, onSuccess)

    const handleNewSubmission = () => {
        Object.entries(uploaders).map(([inp, uploader]) => {
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
                            <Typography variant="h5">
                                Run : {data?.name}
                            </Typography>
                            <StatusButton status={data['status']} />
                        </Box>
                        <Typography variant="h5" pb={1}>
                            Uploads
                        </Typography>
                        <Divider />
                        {Object.entries(uploaders).map(([inp, uploader]) => {
                            return (
                                <>
                                    <Grid py={2}>
                                        <Typography > {inp} </Typography>
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