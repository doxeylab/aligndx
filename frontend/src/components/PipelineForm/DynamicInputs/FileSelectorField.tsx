import { useFormContext } from "react-hook-form";
import { FileSelector } from "../../Uploader";
import { useEffect, useState } from 'react'
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box'

interface FileSelectorProps {
    name: string;
    defaultValue?: string;
    uploader: any;
    readyStatus?: any;
    setReadyStatus?: any;
    plugins: any;
    [fileSelectorProps: string]: any;
}

export default function FileSelectorField({ name, defaultValue, uploader, plugins, readyStatus, setReadyStatus, ...fileSelectorProps }: FileSelectorProps) {
    const [files, setFiles] = useState<any>([])
    const { register, setValue, formState } = useFormContext();

    uploader.off('files-added', null).on('files-added', (uppy_files: any) => {
        const new_files = uppy_files.map((a: any) => a.data.name)
        setFiles([...files, ...new_files])
    })
    uploader.once('restore-confirmed', () => {
        const filesState = uploader.getState()['files']
        const new_files = Object.values(filesState).map((a: any) => a.name)
        setFiles([...files, ...new_files])
    })
    uploader.off('file-removed', null).on('file-removed', (file: any, reason: any) => {
        if (reason === 'cancel-all') {
            setFiles([])
        }
        else {
            if (files.length) {
                setFiles(files.filter((e: any) => e != file.name))
            }
            else {
                setFiles([])
            }
        }
    })
    uploader.off('cancel-all', null).on('cancel-all', () => {
        setFiles([])
        setReadyStatus({...readyStatus, [name] : null })
    })
    uploader.off('error', null).on('error', (error: any) => {
        console.log(error)
        setFiles([])
    })
    uploader.off('complete', null).on('complete', (result: any) => {
        if (result.successful.length > 0) {
            setReadyStatus({...readyStatus, [name] : true })
        }
        else {
            setReadyStatus({...readyStatus, [name] : false })
        }
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
            {formState.errors[name] ?
                <FormHelperText error>
                    <>
                        {formState?.errors?.[name]?.message}
                    </>
                </FormHelperText> : " "}
        </>
    )
}

