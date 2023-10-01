import { FormSelect, FormTextField, } from '../../Form';
import isEmpty from '../../../utils/isEmpty';

import Typography from '@mui/material/Typography' 
import Grid from '@mui/material/Grid'

import SubmissionNameField from './SubmissionNameField';
import FileSelectorField from './FileSelectorField';

interface DynamicInputsProps {
    selectedPipeline: any;
    uploaders?: any;
    readyStatus?: any;
    setReadyStatus?: any;
}

export default function DynamicInputs({ selectedPipeline, uploaders, readyStatus, setReadyStatus}: DynamicInputsProps) {

    return (
        <>
            <Grid container py={2} justifyContent='space-between'>
                <Grid item xs>
                    <SubmissionNameField name="name" />
                </Grid>
                {selectedPipeline?.inputs.map((input: any) => {
                    if (input.input_type === 'file') {
                        // can be files, folders or both
                        let selectionType = 'files'
                        if (input.count == 'single') {
                            selectionType = 'both'
                        }

                        let plugins = [""]
                        const imageTypes = ["image/jpeg	", "image/png"]
                        const needsCam = input.file_types.some((r : any) => imageTypes.includes(r))

                        if (needsCam) {
                            plugins = ['MyWebCam', 'GoogleDrive', 'Url']
                        }
                        else {
                            plugins = ['GoogleDrive', 'Url']
                        }

                        const uploader = uploaders?.[selectedPipeline.id]?.[input.id]

                        return (
                            <Grid item xs={12} mb={1} key={input.id}>
                                {isEmpty(uploader) ?
                                    null
                                    :
                                    <FileSelectorField
                                        width={'100%'}
                                        name={input.id}
                                        uploader={uploader}
                                        plugins={plugins}
                                        fileManagerSelectionType={selectionType}
                                        readyStatus={readyStatus}
                                        setReadyStatus={setReadyStatus}
                                    />}
                            </Grid>
                        )
                    }
                    if (input.input_type == 'select') {
                        return (
                            <Grid item xs={12} sm={6} md={6} lg={3} pb={2} key={input.id} >
                                <FormSelect
                                    name={input.id}
                                    label={input.title}
                                    options={input.options}
                                    getOptionLabel={(option : any) => option || ""}
                                    isOptionEqualToValue={(option: any, value: any) => option === value}
                                />
                            </Grid>
                        )
                    }
                    if (input.input_type == 'text') {
                        return (
                            <Grid item xs={12} sm={6} md={6} lg={3} pb={2} key={input.id} >
                                <Typography>{input.title}</Typography>
                                <FormTextField name={input.id} label={input.title} type={""} />
                            </Grid>
                        )
                    }
                })
                }

            </Grid>

        </>
    )
}