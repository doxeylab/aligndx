import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingSpinner from '../../components/LoadingSpinner';

import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useLocalStorage from '../../hooks/useLocalStorage';
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'

import { useMeta } from '../../api/Meta'
import useWebSocket from '../../api/Socket'

import Download from '../../components/Download';
import Report from '../../components/Report';

const Uploader = dynamic(() => import('../../components/Uploader'), {
    ssr: false,
})

export default function Analyze() {
    const [pipelineData, setPipelineData] = useState([])
    const [value, setValue] = useLocalStorage('sel_value', null);
    const [inputValue, setInputValue] = useLocalStorage('sel_input', '');
    const [upload, setUpload] = useLocalStorage('uploadparams', {} as any);
    const [subId, setSubId] = useLocalStorage('subId', "" as any);
    const [status, setStatus] = useLocalStorage('status', {} as any);
    const [result, setResult] = useLocalStorage('result', "" as any)
    const [snackbar, setSnackBar] = useState(false);

    const handleClickOpen = (callback: any) => {
        callback(true);
    };

    const handleClose = (callback: any) => {
        callback(false);
    };

    const updateParentSubId = (id: string) => {
        setSubId(id)
    }

    const { connectWebsocket } = useWebSocket();
    const meta = useMeta();

    const pipeMeta = useQuery({
        queryKey: ['pipelineData'],
        queryFn: meta.get_pipelines,
        onSuccess(data) {
            const raw_data = data?.data
            const pipeline_meta = Object.keys(raw_data).map(key => raw_data[key]);
            setPipelineData(pipeline_meta)
        },
    })

    useEffect(() => {
        if (value != null) {
            let sel = pipelineData.find((o: any) => o.id === value.id)

            if (sel != undefined) {
                if (sel?.pluginType == 'visual')
                    sel['plugins'] = ["MyWebCam", "MyImageEditor", "GoogleDrive"]
                else {
                    sel['plugins'] = ["GoogleDrive", "OneDrive", "Dropbox", "Url"]
                }
                setUpload(sel)
            }
        }

    }, [value])

    const dataHandler = (event: any) => {
        console.log(event)
        if (event.type == 'message') {
            let data = JSON.parse(event.data)
            console.log(data)
            setStatus(data)
        }
    }

    useEffect(() => {
        if (subId != '') {
            connectWebsocket(subId, dataHandler)
        }
    }, [subId])

    useEffect(() => {
        if (status['status'] === 'completed') {
            handleClickOpen(setSnackBar)
        }

    }, [status])

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4, }}>
                <Snackbar open={snackbar} autoHideDuration={2000} onClose={() => handleClose(setSnackBar)}>
                    <Alert onClose={() => handleClose(setSnackBar)} severity="success" sx={{ width: '100%' }}>
                        Your results are ready!
                    </Alert>
                </Snackbar>
                <Grid container spacing={3}>
                    <Grid item xs={10} sm={6} md={4}>
                        <Paper
                            sx={{
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Autocomplete
                                autoComplete
                                value={value}
                                inputValue={inputValue}
                                onChange={(event: any, newValue: any | null) => {
                                    setValue(newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}

                                disablePortal
                                id="pipelines"
                                options={pipelineData}
                                // groupBy={(option) => option.label}
                                getOptionLabel={(option) => option.id}
                                renderInput={(params) => <TextField {...params} label="Select a pipeline" />}
                            />
                        </Paper>

                    </Grid>
                    {value ?
                        <>
                            <Grid item xs={12} md={8}>
                                <Paper
                                    sx={{
                                        p: 4,
                                    }}
                                >
                                    <Typography>{upload?.name}</Typography>
                                    {upload?.description}
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Uploader
                                    id={`uppy_${upload?.label}`}
                                    fileTypes={upload?.fileTypes}
                                    meta={
                                        {
                                            pipeline: value.id,
                                        }
                                    }
                                    updateParentSubId={updateParentSubId}
                                    plugins={upload?.plugins}
                                    height={'40vh'}
                                    width={'100%'}
                                />
                            </Grid>
                        </>
                        :
                        null
                    }

                    {subId ?
                        <Grid item xs={12} >
                            <Paper component={Stack} direction="column">
                                {
                                    status['status'] != 'completed'
                                        ?
                                        <>
                                            <LoadingSpinner />
                                            <Grid container justifyContent="center" alignItems="initial">
                                                <Typography variant='h5'>
                                                    {status['status']}
                                                </Typography>
                                            </Grid>
                                        </>
                                        :
                                        null
                                }
                                {
                                    status['status'] == 'completed'
                                        ?
                                        <>
                                            <Grid container justifyContent="center" alignItems="initial" p={2}>
                                                <Typography variant='h5'>
                                                    Results
                                                </Typography>
                                            </Grid>
                                            <Grid container justifyContent="center" alignItems="initial" columnGap={5}>
                                                <Grid item>
                                                    <Report subId={subId} />
                                                </Grid>
                                                <Grid item>
                                                    <Download subId={subId} />
                                                </Grid>
                                            </Grid>
                                        </>

                                        :
                                        null
                                }

                            </Paper>
                        </Grid>
                        :
                        null
                    }
                </Grid>
            </Container>
        </>
    )
}
