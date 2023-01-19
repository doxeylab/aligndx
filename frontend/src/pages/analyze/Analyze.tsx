import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingSpinner from '../../components/LoadingSpinner';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import { useEffect, useState } from 'react';
import { Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import useLocalStorage from '../../hooks/useLocalStorage';
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'

import { useMeta } from '../../api/Meta'
import { useSubmissions } from '../../api/Submissions'
import useWebSocket from '../../api/Socket'

import Download from '../../components/Download';
import Report from '../../components/Report';
import getRandomName from '../../utils/getRandomName';
import * as yup from "yup";

const Uploader = dynamic(() => import('../../components/Uploader'), {
    ssr: false,
})

export default function Analyze() {
    const [pipelineData, setPipelineData] = useState([])
    const [value, setValue] = useLocalStorage('sel_value', null);
    const [inputValue, setInputValue] = useLocalStorage('sel_input', '');
    const [upload, setUpload] = useLocalStorage('uploadparams', {} as any);
    const [subId, setSubId] = useLocalStorage('subId', "" as any);
    const [status, setStatus] = useState(false)
    const [snackbar, setSnackBar] = useState(false);
    const [name, setName] = useState(getRandomName());
    const [error, setError] = useState({'error': false, 'message': ''});
    const [submissionData, setSubmissionData] = useState({});

    const schema = yup.object({
        name: yup
            .string()
            .required('No name provided')
            .min(8, 'Name should be 8 chars minimum.')
            .max(20, 'Exceeded name char limit')
            .matches(/^[a-zA-Z0-9_]+$/, '*No special characters except underscores'),

    })

    const handleChange = (event: any) => {
        setName(event.target.value);
        try {
            schema.validateSync({ 'name': event.target.value })
            setError({
                'error': false,
                'message': ''
            })
        }
        catch (err) {
            setError({
                'error': true,
                'message': err.errors[0]
            })

        }
    }

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
    const submissions = useSubmissions();

    const dataHandler = (event: any) => {
        if (event.type == 'message') {
            let data = JSON.parse(event.data)
            console.log(data.status)
            console.table(data.processes)
            setStatus(data)
        }
    }

    const submission_status = useQuery({
        queryKey: ['sub_status', subId],
        retry: false,
        enabled: true,
        queryFn: () => subId ? submissions.get_submission(subId) : null,
        onSuccess(data) {
            setSubmissionData(data?.data)
            let status = data?.data['status']
            if (status && status != 'completed') {
                connectWebsocket(subId, dataHandler)
            }
            // else {
                // setSubId(null)
            // }
        },
        onError(err) {
            setSubId(null)
        }
    })

    const pipeMeta = useQuery({
        queryKey: ['pipelineData'],
        retry: 1,
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
                    // sel['plugins'] = ["GoogleDrive", "OneDrive", "Dropbox", "Url"]
                    sel['plugins'] = ["GoogleDrive", "Url"]
                }
                setUpload(sel)
            }
        }

    }, [value])


    useEffect(() => {
        if (status['status'] === 'completed') {
            handleClickOpen(setSnackBar)
        }

    }, [status])

    // useEffect(() => {
    //     if (subId != "") {
    //         connectWebsocket(subId, dataHandler)
    //     }

    // }, [subId])


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
                                <Paper sx={{
                                    p: 2
                                }}>
                                    <Grid container item xs={12} sm={9} md={6} lg={3} pb={2}
                                        alignItems="center"
                                    >
                                        <Grid >
                                            <TextField
                                                label="Run Name"
                                                fullWidth
                                                value={name}
                                                onChange={handleChange}
                                                error={error.error}
                                                helperText={error.message}
                                            />
                                        </Grid>
                                        <Grid >
                                            <Tooltip title={'Generate a random name'} placement={'top'}>
                                                <IconButton onClick={() => {
                                                    let name = getRandomName()
                                                    setName(name)
                                                    setError({'error': false, 'message': ''})
                                                }}>
                                                    <ShuffleIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                    <Uploader
                                        id={`uppy_${upload?.label}`}
                                        fileTypes={upload?.fileTypes}
                                        meta={
                                            {
                                                pipeline: value.id,
                                                name: name
                                            }
                                        }
                                        updateParentSubId={updateParentSubId}
                                        plugins={upload?.plugins}
                                        width={'100%'}
                                        disabled={error.error}
                                    />
                                </Paper>

                            </Grid>
                        </>
                        :
                        null
                    }

                    {subId ?
                        <Grid item xs={12} >
                            <Paper component={Stack} direction="column">
                                {
                                    status && status['status'] != 'completed'
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
                                    status && status['status'] == 'completed' || submissionData?.status == 'completed'
                                        ?
                                        <>
                                            <Grid container justifyContent="center" alignItems="initial" p={2}>
                                                <Typography variant='h5'>
                                                    Results for {submissionData?.name}
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
