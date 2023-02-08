import { useFormContext } from "react-hook-form";
import { FileSelector } from "../../Uploader";
import { useEffect, useState } from 'react'
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
    const [files, setFiles] = useState([])
    const { register, setValue, formState } = useFormContext({
        defaultValues: {
            [name]: []
        }
    });

    uploader.off('files-added', null).on('files-added', (uppy_files) => {
        const new_files = uppy_files.map((a: any) => a.data.name)
        setFiles([...files, ...new_files])
    })
    uploader.once('restore-confirmed', () => {
        const filesState = uploader.getState()['files']
        const new_files = Object.values(filesState).map((a: any) => a.name)
        setFiles([...files, ...new_files])
    })
    uploader.off('file-removed', null).on('file-removed', (file, reason) => {
        if (reason === 'cancel-all') {
            setFiles([])
        }
        else {
            if (files.length) {
                setFiles(files.filter(e => e != file.name))
            }
            else {
                setFiles([])
            }
        }
    })
    uploader.off('cancel-all', null).on('cancel-all', () => {
        setFiles([])
    })
    uploader.off('error', null).on('error', (error) => {
        setFiles([])
    })
    uploader.off('complete', null).on('complete', (result) => {
        setFiles([])
    })

    useEffect(() => {
        register(name, { required: true });
    }, [])

    useEffect(() => {
        if (files.length == 0) {
            setValue(name, null)
        }
        else {
            setValue(name, files, { shouldValidate: true })
        }
    }, [files])

    useEffect(() => {
        console.log(formState.errors[name])
    },[formState])

    return (
        <>
            <Box sx={{ border: formState.errors[name] ? '2px solid red' : null }}>
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

