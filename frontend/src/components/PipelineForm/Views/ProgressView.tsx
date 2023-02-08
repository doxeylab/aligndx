import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { StatusBar } from '@uppy/react'
import { useState, useEffect } from "react";
import useWebSocket from "../../../api/Socket";
import StatusButton from "./StatusButton";
import useSubmissionStatus from './useSubmissionStatus'
import CircularProgress from '@mui/material/CircularProgress';
import { CrossFade } from "../CrossFade";

import Download from '../../../components/Download';
import Report from '../../../components/Report';

export default function ProgressView({ subId, setSuccess, selectedPipeline, uploaders }) {
    const [complete, setComplete] = useState(false);
    const [data, setData] = useState({} as any);

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
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                    Run | {data?.name}
                                </Typography>
                            </Paper>
                            <StatusButton status={data['status']} />
                        </Box>
                        <CrossFade
                            components={[
                                {
                                    in: complete == false,
                                    component: <>
                                        <Typography variant="h5" pb={1}>
                                            Uploads
                                        </Typography>
                                        <Divider />
                                        {Object.entries(uploaders[selectedPipeline?.id]).map(([inp, uploader]) => {
                                            const currInp = selectedPipeline?.inputs.find(e => e.id === inp)
                                            return (
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
                                            )
                                        })}
                                        <Typography variant="h5" pb={1}>
                                            Analysis
                                        </Typography>
                                        <Divider />
                                        <Grid container direction={'column'} py={3} justifyContent={'center'} alignItems={'center'}>
                                            <Grid item>
                                                <CircularProgress />

                                            </Grid>
                                            Tinkering ...
                                        </Grid>
                                    </>
                                },
                                {
                                    in: complete,
                                    component: <>
                                        <Typography variant="h5" pb={1}>
                                            Results
                                        </Typography>
                                        <Divider />
                                        <Grid
                                            container
                                            pt={4}
                                        >
                                            <Grid pb={4} container justifyContent="center" alignItems="initial" columnGap={5}>
                                                <Grid item>
                                                    <Report subId={subId} />
                                                </Grid>
                                                <Grid item>
                                                    <Download subId={subId} />
                                                </Grid>
                                            </Grid>
                                            <Button
                                                variant={'contained'}
                                                onClick={handleNewSubmission}>
                                                New
                                            </Button>

                                        </Grid>
                                    </>
                                },
                            ]}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}