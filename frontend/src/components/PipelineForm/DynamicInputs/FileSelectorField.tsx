import { Controller, useFormContext } from "react-hook-form";
import { FileSelector } from "../../Uploader";
import { useEffect } from 'react'

interface FileSelectorProps {
    name: string;
    defaultValue?: string;
    uploader: any;
    plugins: any;
    [fileSelectorProps: string]: any;
}

export default function FileSelectorField({ name, defaultValue, uploader, plugins, ...fileSelectorProps }: FileSelectorProps) {
    const { register, setValue, formState} = useFormContext({
        defaultValues:{
            [name]: ''
        }
    });

    uploader.off('files-added', null).on('files-added', (files) => {
        const values = files.map((a: any) => a.data.name)
        setValue(name, values, { shouldValidate: true })
    })
    uploader.once('restore-confirmed', () => {
        const currentUploads = []
        currentUploads.push(uploader.getState()['files'])
        setValue(name, currentUploads, { shouldValidate: true })
    })
    uploader.off('file-removed', null).on('file-removed', (file, reason) => {
        setValue(name, null, { shouldValidate: true })
    })
    uploader.off('cancel-all', null).on('cancel-all', (file, reason) => {
        setValue(name, null, { shouldValidate: true })
    })
    uploader.off('error', null).on('error', (file, reason) => {
        setValue(name, null, { shouldValidate: true })
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
            <FileSelector
                name={name}
                uploader={uploader}
                plugins={plugins}
                {...fileSelectorProps}
            />
        </>
    )
}

