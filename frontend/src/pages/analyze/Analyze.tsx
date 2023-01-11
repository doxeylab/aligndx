import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import DownloadIcon from '@mui/icons-material/Download';
import PageviewIcon from '@mui/icons-material/Pageview';
import IconButton from '@mui/material/IconButton';
import LoadingSpinner from '../../components/LoadingSpinner';

import { useEffect, useState } from 'react';
import { Button, Stack, Tooltip, Typography } from '@mui/material';
import useLocalStorage from '../../hooks/useLocalStorage';
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'

import { useMeta } from '../../api/Meta'
import { useResults } from '../../api/Results'
import useWebSocket from '../../api/Socket'

import CustomIframe from '../../components/CustomIframe';
import FullScreenDialog from '../../components/FullScreenDialog';
import { Download } from '@mui/icons-material';

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
    const [open, setOpen] = useState(false);
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
    const results = useResults();
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

    const report = useQuery({
        queryKey: ['report', subId],
        queryFn: () => results.get_report(subId),
        enabled: false,
        onSuccess(data) {
            setResult(data?.data)
        },
    })

    function saveAs(blob, fileName) {
        var url = window.URL.createObjectURL(blob);

        var anchorElem = document.createElement("a");
        anchorElem.style = "display: none";
        anchorElem.href = url;
        anchorElem.download = fileName;

        document.body.appendChild(anchorElem);
        anchorElem.click();

        document.body.removeChild(anchorElem);

        // On Edge, revokeObjectURL should be called only after
        // a.click() has completed, atleast on EdgeHTML 15.15048
        setTimeout(function () {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }


    const download = useQuery({
        queryKey: ['download', subId],
        queryFn: () => results.download(subId),
        enabled: false,
        onSuccess(data) {
            let blob = new Blob([data.data], { type: "application/octet-stream" });
            let name = data.headers['content-disposition']?.split('filename=')[1].split(';')[0];
            saveAs(blob, name)
        }
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
            report.refetch()
        }

    }, [status])

    useEffect(() => {
        handleClickOpen(setSnackBar)

    }, [result])

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
                                            {
                                                result ?
                                                    <Grid container justifyContent="center" alignItems="initial" columnGap={5}>
                                                        <Grid item>
                                                            <Tooltip title="View Report">
                                                                <IconButton aria-label="view-report"
                                                                    size="large"
                                                                    onClick={() => handleClickOpen(setOpen)}>
                                                                    <PageviewIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item>
                                                            <Tooltip title="Download Results">
                                                                <IconButton
                                                                    size="large"
                                                                    aria-label="download"
                                                                    onClick={() => download.refetch()}>
                                                                    <DownloadIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                    </Grid>
                                                    :
                                                    null
                                            }
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
                {subId && results ?
                    <>
                        <FullScreenDialog
                            open={open}
                            handleClose={() => handleClose(setOpen)}
                            content={
                                <CustomIframe
                                    width={'100%'}
                                    height={'100%'}
                                    frameBorder={0}
                                    srcDoc={result} />
                            } />
                    </>
                    :
                    null}
            </Container>
        </>
    )
}
