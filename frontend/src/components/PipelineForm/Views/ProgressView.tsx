import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { StatusBar } from '@uppy/react'
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import useWebSocket from "../../../api/Socket";
import useSubmissionStatus from './useSubmissionStatus'

export default function ProgressView({ subId, setSucess, uploaders }) {
    const [complete, setComplete] = useState(false);
    const [data, setData] = useState({} as any);

    const methods = useFormContext()
    const { connectWebsocket } = useWebSocket();

    const dataHandler = (event: any) => {
        if (event.type == 'message') {
            const data = JSON.parse(event.data)
            setData(data)
            if (data?.status == 'completed') {
                setComplete(true)
            }
        }
    }

    const onSuccess = (data: any) => {
        setData(data?.data)
        const status = data?.data['status']
        if (status && status != 'completed') {
            connectWebsocket(subId, dataHandler)
        }
        else {
            setComplete(true)
        }
    }

    const status = useSubmissionStatus(subId, onSuccess)

    Object.entries(uploaders).map(([inp, uploader]) => {
        uploader.off('complete', null).on('complete', (result) => {
            if (result.sucessful.length > 0) {
                uploader.cancelAll()
                methods.setValue(inp, null, { shouldValidate: true })
            }
        })

    })

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
                            <Button
                                color="success"
                                variant={'contained'}>
                                {data?.status}
                            </Button>
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
                                    onClick={() => setSucess(false)}>
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