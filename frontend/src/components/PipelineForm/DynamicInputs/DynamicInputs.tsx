import { useFormContext } from 'react-hook-form';
import { Fragment, useEffect, useState } from 'react';
import { FormSelect, FormTextField, } from '../../Form';
import isEmpty from '../../../utils/isEmpty';

import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid'

import SubmissionNameField from './SubmissionNameField';
import FileSelectorField from './FileSelectorField';

interface DynamicInputsProps {
    selectedPipeline: any;
    uploaders?: any;
}

export default function DynamicInputs({ selectedPipeline, uploaders }: DynamicInputsProps) {
    const [open, setOpen] = useState({})
    const methods = useFormContext();
    const handleOpen = (id: string) => {
        setOpen({
            ...open,
            [id]: true
        })
    }

    const handleClose = (id: string) => {
        setOpen({
            ...open,
            [id]: false
        })
    }

    if (isEmpty(selectedPipeline) == false) {
        return (
            <>
                <Grid container py={2} justifyContent='space-between'>
                    <Grid item xs>
                        <SubmissionNameField name="name" />
                    </Grid>
                    {selectedPipeline?.inputs.map((input: any) => {
                        if (input.input_type === 'file') {
                            let plugins = [""]
                            const imageTypes = ["image/jpeg	", "image/png"]
                            const needsCam = input.file_types.some(r=> imageTypes.includes(r))

                            if (needsCam) {
                                plugins = ['GoogleDrive', 'Url', 'MyWebCam']
                            }
                            else {
                                plugins = ['GoogleDrive', 'Url']
                            }

                            if (isEmpty(uploaders)) {
                                return (null)
                            }
                            else {
                                return (
                                    <Grid item xs={12} mb={1} key={input.id}>
                                        <FileSelectorField
                                            width={'100%'}
                                            name={input.id}
                                            uploader={uploaders[selectedPipeline.id][input.id]}
                                            plugins={plugins} />
                                    </Grid>
                                )
                            }
                        }
                        if (input.input_type == 'select') {
                            return (
                                <Grid item xs={12} sm={6} md={6} lg={3} pb={2} key={input.id} >
                                    <FormSelect
                                        name={input.id}
                                        label={input.title}
                                        options={input.options}
                                        getOptionLabel={(option) => option || ""}
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
    else {
        return null
    }

}