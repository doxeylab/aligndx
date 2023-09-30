import { Box, Divider, Button, Grid, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';

import CrossFade from "../CrossFade";
import Download from '../../components/Download';
import Report from '../../components/Report';

import useSubmissionStatus from './useSubmissionStatus'
import useWebSocket from "../../api/Socket";
import Status from "./Status";
import { StatusBar } from '@uppy/react'

interface IMonitor {
    handleNew: any;
    subId: any;
    uploaders: any;
    selectedPipeline: any;
}

export default function Monitor({ handleNew, subId, uploaders, selectedPipeline }: IMonitor) {
    const [data, setData] = useState({} as any);
    const [completed, setCompleted] = useState(false);

    const { connectWebsocket } = useWebSocket();

    const dataHandler = (event: any) => {
        if (event.type == 'message') {
            const resp = JSON.parse(event.data)
            setData(resp)
        }
    }

    const onSuccess = (data: any) => {
        const status = data?.data['status']
        const connect_reasons = ['completed', 'error']
        if (connect_reasons.includes(status) == false) {
            connectWebsocket(subId, dataHandler)
        }
        else {
            setData(data?.data)
            setCompleted(true)
        }
    }

    const status = useSubmissionStatus(subId, onSuccess)

    useEffect(() => {
        if (data['status'] == 'completed' || data['status'] == 'error') {
            setCompleted(true)
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
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            pb={2}
                            spacing={2}
                            sx={{
                                justifyContent: { xs: "center", sm: "space-between" }
                            }}
                        >
                            <Grid item>
                                <Paper sx={{ backgroundColor: 'black', padding: 1 }} elevation={2}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        Run | {data?.name}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper sx={{ backgroundColor: 'black', padding: 1 }} elevation={2}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        Job in position {data?.position} of queue
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Status status={data['status']} />
                            </Grid>
                        </Grid>
                        <CrossFade
                            components={[
                                {
                                    in: completed == false,
                                    component: <>
                                        <Typography variant="h5" pb={1}>
                                            Uploads
                                        </Typography>
                                        <Divider />
                                        {Object.entries(uploaders[selectedPipeline?.id]).map(([inp, uploader] : any) => {
                                            const currInp = selectedPipeline?.inputs.find((e : any) => e.id === inp)
                                            return (
                                                <Grid py={2} key={`${selectedPipeline.id}-${inp}-uploadprogress`}>
                                                    <Typography > {currInp.title} </Typography>
                                                    <StatusBar
                                                        uppy={uploader}
                                                        hideUploadButton
                                                        hideAfterFinish={false}
                                                        showProgressDetails={true}
                                                        hideRetryButton={true}
                                                        hidePauseResumeButton={false}
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
                                    in: completed,
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
                                            <Grid container justifyContent={'center'}>
                                                <Button
                                                    variant={'contained'}
                                                    onClick={handleNew}>
                                                    New Submission
                                                </Button>
                                            </Grid>

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