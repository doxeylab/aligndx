import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid'

import SubmissionNameField from './SubmissionNameField';
import { Fragment, useEffect, useState } from 'react';
import { FormSelect, FormTextField, } from '../../Form';
import isEmpty from '../../../utils/isEmpty';
import { useFormContext } from 'react-hook-form';

interface DynamicInputsProps {
    selectedPipelineInputs: any;
    uploaders?: any;
    setUploaders?: any;
}

export default function DynamicInputs({ selectedPipelineInputs, uploaders, setUploaders }: DynamicInputsProps) {
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

    if (isEmpty(selectedPipelineInputs) == false) {
        return (
            <>
                <Grid >
                    <SubmissionNameField name="name" />
                </Grid>
                {selectedPipelineInputs.map((input: any) => {
                    if (input.input_type === 'file') {
                        return (
                            <Grid item mb={1} height={'20%'} key={input.id}>
                                {isEmpty(uploaders) == false ?
                                    <>
                                        {/* sp,ethom */}
                                    </>
                                    :
                                    null}
                            </Grid>
                        )
                    }
                    if (input.input_type == 'select') {
                        return (
                            <Grid item xs={12} sm={6} md={6} lg={3} pb={2} key={input.id} >
                                <Typography>{input.title}</Typography>
                                <FormSelect
                                    name={input.id}
                                    label={input.title}
                                    options={input.options}
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
            </>
        )
    }
    else {
        return null
    }

}