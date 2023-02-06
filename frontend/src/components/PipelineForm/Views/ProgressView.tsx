import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { StatusBar } from '@uppy/react'
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ProgressView({ data, setSucess, uploaders }) {
    const [complete, setComplete] = useState(false);
    const methods = useFormContext()

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
                                Run : {data.name}
                            </Typography>
                            <Button color="success" variant={'contained'} >status</Button>

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
                            <Button onClick={() => setSucess(false)}>New Submission</Button>
                            :
                            null
                        }
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}