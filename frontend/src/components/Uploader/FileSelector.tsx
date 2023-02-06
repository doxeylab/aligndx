import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import '@uppy/image-editor/dist/style.css'

interface FileSelectorProps {
    uploader: any;
    plugins?: string[];
    [dashProps: string]: any;
}

export default function FileSelectorProps({ uploader, plugins, ...dashProps }: FileSelectorProps) {
    return (
        <Dashboard
            uppy={uploader}
            plugins={plugins ? plugins : null}
            theme={'dark'}
            proudlyDisplayPoweredByUppy={false}
            hideUploadButton={true}
            hideRetryButton={true}
            doneButtonHandler={null}
            {...dashProps}

        />
    )
}