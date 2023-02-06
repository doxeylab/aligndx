import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import getRandomName from "../../../utils/getRandomName";

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

interface FormTextFieldProps {
    name: string;
    defaultValue?: string;
    [textFieldProps: string]: any;
}

export default function SubmissionNameField({ name, defaultValue, ...textFieldProps }: FormTextFieldProps) {
    const methods = useFormContext();
    return (
        <Controller
            name={name}
            control={methods?.control}
            defaultValue={defaultValue ? defaultValue : getRandomName()}
            render={({ field }: any) =>
                <>
                    <Box
                        display={'flex'}
                        alignItems="baseline"
                    >
                        <TextField
                            label="Run Name"
                            {...field}    
                            error={!!methods?.formState.errors[name]}
                            helperText={methods?.formState.errors[name] ? methods?.formState.errors[name]?.message : " "}
                            variant={'filled'}
                            sx={{ width: '100%', marginBottom: '1em' }}
                            {...textFieldProps}
                        />
                        <Tooltip title={'Generate a random name'} placement={'top'}>
                            <IconButton onClick={() => {
                                methods.setValue(name, getRandomName(), { shouldValidate: true })
                            }}>
                                <ShuffleIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </>
            }
        />
    )
}

