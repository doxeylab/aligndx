import { Controller, useFormContext } from 'react-hook-form'
import TextField, { TextFieldProps } from '@mui/material/TextField'

type FormTextFieldProps = TextFieldProps & {
    name: string
}

export default function FormText({
    name,
    helperText,
    type,
    ...rest
}: FormTextFieldProps) {
    const methods = useFormContext()
    return (
        <Controller
            name={name}
            control={methods?.control}
            render={({ field, fieldState: { error } }) => (
                <>
                    <TextField
                        {...field}
                        InputLabelProps={{ shrink: true }}
                        id="filled-basic"
                        type={type}
                        variant="filled"
                        error={!!error}
                        helperText={error ? error?.message : helperText}
                        {...rest}
                    />
                </>
            )}
        />
    )
}
