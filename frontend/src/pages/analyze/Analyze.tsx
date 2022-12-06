import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import Container from '@mui/material/Container'
import Uploader from '../../components/Uploader'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useAuthContext } from '../../context/AuthProvider';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function Analyze() {
    const context = useAuthContext();

    // make some request to the backend to get list of available pipelines
    // list available pipelines

    interface pipelineParams extends Record<string, any> {
        label: string;
        fileTypes: string[];
        pluginType: string;
        description: string;
    }

    const pipelines: pipelineParams[] = [
        {
            label: 'RNA',
            fileTypes: ['.fastq.gz', '.fastq'],
            pluginType: 'Regular',
            description: 'This is the description of this pipeline'
        },
        {
            label: 'Lateral Flow',
            fileTypes: ['.jpg, .png'],
            pluginType: 'Camera',
            description: 'This is the description of this pipeline'
        }
    ]
    const pipelineOptions = pipelines.map(o => o.label)

    const [value, setValue] = useLocalStorage('sel_value', "");
    const [inputValue, setInputValue] = useLocalStorage('sel_input', "");
    const [upload, setUpload] = useLocalStorage('uploadparams', {} as any);

    useEffect(() => {
        let sel = pipelines.find(o => o.label === value)
        if (sel != undefined) {
            if (sel?.pluginType == 'Camera')
                sel['plugins'] = ["MyWebCam", "MyImageEditor"]
            else {
                sel['plugins'] = ["GoogleDrive", "OneDrive", "Dropbox", "Url"]
            }
            setUpload(sel)
        }
    }, [value])


    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Paper
                            sx={{
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 120
                            }}
                        >
                            <Autocomplete
                                autoComplete
                                onChange={(event: any, newValue: any | null) => {
                                    setValue(newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                isOptionEqualToValue={(option, value) => option === value}
                                disablePortal
                                id="pipelines"
                                options={pipelineOptions}
                                renderInput={(params) => <TextField {...params} label="Select a pipeline" />}
                            />
                        </Paper>

                    </Grid>
                    {value ?
                        <>
                            <Grid item xs={8}>
                                <Paper
                                    sx={{
                                        p: 4,
                                        height: 120

                                    }}
                                >
                                    <Typography>{upload?.label}</Typography>
                                    {upload?.description}
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Uploader
                                    id={`uppy_${upload?.label}`}
                                    fileTypes={upload?.fileTypes}
                                    meta={
                                        {
                                            username: context?.auth?.user
                                        }
                                    }
                                    plugins={upload?.plugins}
                                    height={'100%'}
                                    width={'100%'}
                                />
                            </Grid>
                        </>

                        :
                        null
                    }

                </Grid>
            </Container>
        </>
    )
}
