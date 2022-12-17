/* eslint-disable */
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import GoogleDrive from "@uppy/google-drive";
import DropBox from "@uppy/dropbox";
import OneDrive from "@uppy/onedrive";
import Url from "@uppy/url";
import WebCam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import Dashboard from "@uppy/react/lib/Dashboard";
import GoldenRetriever from '@uppy/golden-retriever'

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import '@uppy/image-editor/dist/style.css'
import { useEffect, useState } from "react";
import {COMPANION_URL} from '../../config/Settings'
import {TUS_ENDPOINT} from '../../config/Settings'

interface UploaderProps {
    id: string;
    meta?: Record<string, unknown>;
    plugins?: string[];
    fileTypes?: string[];
    [dashProps: string]: any;
}

// const COMPANION_URL = "http://companion.uppy.io";
// const TUS_ENDPOINT = "https://tusd.tusdemo.net/files/";

export default function Uploader(props: UploaderProps) {
    const { id, meta, plugins,  fileTypes, ...dashProps } = props
    const [uppy, setUppy] = useState(() => new Uppy())  
    
    useEffect(() => {
        const uppy = new Uppy({
            id: id,
            autoProceed: false,
            allowMultipleUploadBatches: false,
            debug: true,
            restrictions: {
                maxFileSize: null,
                maxTotalFileSize: null,
                maxNumberOfFiles: null,
                allowedFileTypes: (fileTypes ? fileTypes : null),
            },
            meta : (meta? meta : undefined), 
        })
            .use(Tus, { endpoint: TUS_ENDPOINT })
            .use(WebCam, {
                id: 'MyWebCam',
                modes: ['picture'],
                mobileNativeCamera: true
            })
            .use(ImageEditor, {
                id: "MyImageEditor",
                quality: 0.8,
            })
            .use(GoogleDrive, { companionUrl: COMPANION_URL })
            .use(DropBox, { companionUrl: COMPANION_URL })
            .use(OneDrive, { companionUrl: COMPANION_URL })
            .use(Url, { companionUrl: COMPANION_URL })
            .use(GoldenRetriever, { serviceWorker: true });
        setUppy(uppy)
          
    }, [fileTypes, plugins])

    return (
        <>
            {uppy ?
                <Dashboard
                    uppy={uppy}
                    plugins={
                        plugins ?
                            plugins
                            :
                            ["GoogleDrive", "MyWebCam", "OneDrive", "Dropbox", "Url", "MyImageEditor"]
                    }
                    theme={'dark'}
                    {...dashProps}
                    proudlyDisplayPoweredByUppy={false}
                    metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
                />
                :
                null}
        </>
    );
}
