import { Controller, useFormContext } from "react-hook-form";
import { FileSelector } from "../../Uploader";
import { useEffect } from 'react'
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box'

interface FileSelectorProps {
    name: string;
    defaultValue?: string;
    uploader: any;
    plugins: any;
    [fileSelectorProps: string]: any;
}

export default function FileSelectorField({ name, defaultValue, uploader, plugins, ...fileSelectorProps }: FileSelectorProps) {
    const { register, setValue, formState } = useFormContext({
        defaultValues: {
            [name]: ''
        }
    });

    uploader.off('files-added', null).on('files-added', (files) => {
        const values = files.map((a: any) => a.data.name)
        setValue(name, values, { shouldValidate: true })
    })
    uploader.once('restore-confirmed', () => {
        const filesState = uploader.getState()['files']
        const values = Object.values(filesState).map((a: any) => a.name)
        setValue(name, values, { shouldValidate: true })
    })
    uploader.off('file-removed', null).on('file-removed', (file, reason) => {
        setValue(name, "", { shouldValidate: true })
    })
    uploader.off('cancel-all', null).on('cancel-all', (file, reason) => {
        setValue(name, "", { shouldValidate: true })
    })
    uploader.off('error', null).on('error', (file, reason) => {
        setValue(name, "", { shouldValidate: true })
    })
    // uploader.off('complete', null).on('complete', (result) => {
    //     if (result.sucessful.length > 0) {
    //         uploader.cancelAll()
    //         setValue(name, null, {shouldValidate: true})
    //     } 
    // })

    useEffect(() => {
        register(name, { required: true });
    }, [])

    return (
        <>
            <Box sx={{border: formState.errors[name]? '2px solid red' : null}}>
                <FileSelector
                    name={name}
                    uploader={uploader}
                    plugins={plugins}
                    {...fileSelectorProps}
                />
            </Box>
            {formState.errors[name] ? <FormHelperText error>{formState.errors[name].message}</FormHelperText> : " "}
        </>
    )
}

