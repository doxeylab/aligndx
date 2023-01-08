import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useMeta } from '../../api/Meta'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import CustomIframe from '../../components/CustomIframe';

const Uploader = dynamic(() => import('../../components/Uploader'), {
    ssr: false,
})

export default function Analyze() {
    const [pipelineData, setPipelineData] = useState([])

    const [value, setValue] = useLocalStorage('sel_value', null);
    const [inputValue, setInputValue] = useLocalStorage('sel_input', '');
    const [upload, setUpload] = useLocalStorage('uploadparams', {} as any);
    const [subId, setSubId] = useLocalStorage('subId', {} as any);

    const updateParentSubId = (id : string) => {
        setSubId(id)
    }

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
        console.log(value)

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

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4, }}>
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
                                    height={'50vh'}
                                    width={'100%'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomIframe
                                    width={'100%'} 
                                    height={'100%'} 
                                    frameBorder={0}
                                    srcdoc="<p>Some HTML</p>" />
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
