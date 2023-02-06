import { Controller, useFormContext } from "react-hook-form";
import { FileSelector } from "../../Uploader";

import Box from '@mui/material/Box'

interface FileSelectorProps {
    name: string;
    defaultValue?: string;
    uploader: any;
    plugins: any;
    [fileSelectorProps: string]: any;
}

export default function FileSelectorField({ name, defaultValue, uploader, plugins, ...fileSelectorProps }: FileSelectorProps) {
    const methods = useFormContext();

    uploader.off('files-added',null).on('files-added', (files) => {
        const values = files.map((a: any) => a.data.name)
        methods.setValue(name, values, { shouldValidate: true })
    }) 
    uploader.once('restore-confirmed', () => {
        const currentUploads = []
        currentUploads.push(uploader.getState()['files'])
        methods.setValue(name, currentUploads,{ shouldValidate: true })
    }) 
    uploader.off('file-removed',null).on('file-removed', (file, reason) => {
        methods.setValue(name, null, { shouldValidate: true })
    })
    uploader.off('cancel-all',null).on('cancel-all', (file, reason) => {
        methods.setValue(name, null, { shouldValidate: true })
    })
    uploader.off('error','null').on('error', (file, reason) => {
        methods.setValue(name, null, { shouldValidate: true })
    })
    return (
        <Controller
            name={name}
            control={methods?.control}
            defaultValue={defaultValue ? defaultValue : ""}
            render={({ field }: any) =>
                <>
                        <FileSelector
                            uploader={uploader}
                            plugins={plugins}
                            {...fileSelectorProps}
                        />
                </>
            }
        />
    )
}

