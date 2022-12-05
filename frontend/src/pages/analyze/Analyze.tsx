import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import Container from '@mui/material/Container'
import Uploader from '../../components/Uploader'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useAuthContext } from '../../context/AuthProvider';
import useLocalStorage from '../../hooks/useLocalStorage';

export default function Analyze() {
    const context = useAuthContext();

    // make some request to the backend to get list of available pipelines
    // list available pipelines
    const pipelines = [
        {
            label: 'RNA',
            fileTypes: ['.fastq.gz', '.fastq'],
            plugins: ['Regular']
        },
        {
            label: 'Lateral Flow',
            fileTypes: ['.jpg, .png'],
            plugins: ['Camera']
        }
    ]

    const featuredPipelines = pipelines.slice(0, 2)

    const [value, setValue] = useLocalStorage('sel_value', null);
    const [inputValue, setInputValue] = useLocalStorage('sel_input', '');

    // const [value, setValue] = useState<string | null>('');
    // const [inputValue, setInputValue] = useState('');
    const [plugins, setPlugins] = useState([])

    useEffect(() => {
        if (value?.plugins == 'Camera')
            setPlugins(["MyWebCam", "MyImageEditor"])
        else {
            setPlugins(["GoogleDrive", "OneDrive", "Dropbox", "Url"])
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
                                inputValue={inputValue}
                                onChange={(event: any, newValue: object | null) => {
                                    setValue(newValue);
                                }}
                                getOptionLabel={(option) => option.label}
                                // isOptionEqualToValue={(option, value) => option.value === null}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                disablePortal
                                id="pipelines"
                                options={pipelines}
                                renderInput={(params) => <TextField {...params} label="Select a pipeline" />}
                            />
                        </Paper>

                    </Grid>

                    <Grid item xs={8}>
                        <Paper
                            sx={{
                                p: 4,
                                height: 120

                            }}
                        >
                            <Stack alignItems={'center'}>
                                <Typography variant='h5'>
                                    Featured Pipelines:
                                </Typography>
                                <Stack direction={'row'} spacing={2}>
                                    {featuredPipelines.map(({ label, fileTypes, plugins }) => {
                                        return <Button key={`featured_${label}`} variant='contained'>{label} </Button>
                                    })}
                                </Stack>
                            </Stack>
                        </Paper>
                    </Grid>
                    {
                        value ?
                            <Grid item xs={12}>
                                <Uploader
                                    id={`uppy_${value?.label}`}
                                    fileTypes={value?.fileTypes}
                                    meta={
                                        {
                                            username: context?.auth?.user
                                        }
                                    }
                                    plugins={plugins}
                                    height={'100%'}
                                    width={'100%'}
                                />
                            </Grid>
                            :
                            null
                    }

                </Grid>
            </Container>
        </>
    )
}
