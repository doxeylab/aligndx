import { Box, Divider, Button, Grid, Paper, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
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
    const wsRef = useRef<WebSocket | null>(null);

    const { connectWebsocket } = useWebSocket();

    const dataHandler = (event: any) => {
        if (event.type == 'message') {
            const resp = JSON.parse(event.data)
            setData(resp)
        }
        else if (event.type === 'close') {
            status.refetch()
        }
    }

    const onSuccess = (data: any) => {
        const status = data?.data['status'];
        const disconnect_reasons = ['completed', 'error'];

        if (disconnect_reasons.includes(status)) {
            setData(data?.data);
            setCompleted(true);
        } else if (!wsRef.current) {
            const wsInstance = connectWebsocket(subId, dataHandler);
            wsRef.current = wsInstance
        }
    }

    const status = useSubmissionStatus(subId, onSuccess)

    useEffect(() => {
        return () => {
            if (wsRef.current instanceof WebSocket && wsRef.current.readyState !== WebSocket.CLOSED) {
                wsRef.current.close();
                wsRef.current = null
            }
        };
    }, []);

    useEffect(() => {
        console.log(data)
    }, [data])

    const isObjectEmpty = (obj: any) => Object.keys(obj).length === 0;

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
                            {isObjectEmpty(data) ?
                                <Grid container direction={'column'} py={3} justifyContent={'center'} alignItems={'center'}>
                                    <Grid item>
                                        <CircularProgress />

                                    </Grid>
                                    Loading Metadata
                                </Grid>
                                :
                                <>
                                    <Grid item>
                                        <Paper sx={{ backgroundColor: 'black', padding: 1 }} elevation={2}>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                                Run | {data?.name}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Status data={data} />
                                    </Grid>
                                </>}
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
                                        {Object.entries(uploaders[selectedPipeline?.id]).map(([inp, uploader]: any) => {
                                            const currInp = selectedPipeline?.inputs.find((e: any) => e.id === inp)
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
                                        {data?.status == 'processing' ?
                                            <Grid container direction={'column'} py={3} justifyContent={'center'} alignItems={'center'}>
                                                <Grid item>
                                                    <CircularProgress />

                                                </Grid>
                                                Analyzing your data
                                            </Grid>
                                            :
                                            null}
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