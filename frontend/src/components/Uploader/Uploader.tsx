/* eslint-disable */
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import GoogleDrive from "@uppy/google-drive";
import DropBox from "@uppy/dropbox";
import OneDrive from "@uppy/onedrive";
import Url from "@uppy/url";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import { Dashboard } from "@uppy/react";
import GoldenRetriever from '@uppy/golden-retriever'

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import '@uppy/image-editor/dist/style.css'
import { useEffect, useState } from "react";
import { COMPANION_URL } from '../../config/Settings'
import { TUS_ENDPOINT } from '../../config/Settings'

import useRefresh from "../../api/useRefresh"
import CreateSubmission from "./CreateSubmission";
import { useUploads } from "../../api/Uploads";

interface UploaderProps {
    id: string;
    meta?: Record<string, unknown>;
    plugins?: string[];
    fileTypes?: Record<string, unknown>;
    disabled?: boolean;
    [dashProps: string]: any;
}

function useUppy(onCreateOrChange: (uppyInstance: Uppy) => Uppy, deps: any[]) {
    const [uppy, setUppy] = useState(() => {
        const uppy = new Uppy()
        return onCreateOrChange(uppy)
    });

    useEffect(() => {
        setUppy(onCreateOrChange(uppy))
    }, deps);

    return uppy;
}

export default function Uploader(props: UploaderProps) {
    const { id, meta, plugins, fileTypes, updateParentSubId, disabled, ...dashProps } = props
    const availablePlugins = ["GoogleDrive", "MyWebCam", "OneDrive", "Dropbox", "Url", "MyImageEditor"]
    const createSubmission = useUploads();
    const { refresh } = useRefresh();

    const allowed_extensions = fileTypes?.allowed

    const uppy = useUppy(() => {
        const uppy = new Uppy({
            id: id,
            autoProceed: false,
            allowMultipleUploadBatches: false,
            debug: true,
            restrictions: {
                maxFileSize: null,
                maxTotalFileSize: null,
                maxNumberOfFiles: null,
                allowedFileTypes: (fileTypes ? allowed_extensions : null),
            },
            meta: (meta ? meta : {}),
            onBeforeFileAdded: (currentFile: any, files: any) => {
                if (fileTypes?.match.some((s: string) => currentFile.name.endsWith(s)) != true) {
                    // log to console
                    uppy.log(`Invalid filetype`)
                    // show error message to the user
                    uppy.info(`Invalid filetype`, 'error', 500)
                    return false
                }
            },
            infoTimeout: 6000
        })
            .use(Tus, {
                limit: 0,
                endpoint: TUS_ENDPOINT,
                retryDelays: [1000],
                async onBeforeRequest(req: any) {
                    const token = JSON.parse(localStorage.getItem('auth') || '')['accessToken']
                    req.setHeader('Authorization', `Bearer ${token}`)
                },
                onShouldRetry(err: any, retryAttempt: any, options: any, next: any) {
                    const status = err?.originalResponse?.getStatus()
                    if (status === 401) {
                        return true
                    }
                    return next(err)
                },
                async onAfterResponse(req: any, res: any) {
                    if (res.getStatus() === 401) {
                        await refresh()
                    }
                },
            })
            // @ts-ignore
            .use(CreateSubmission, { meta: meta, createSubmission: createSubmission.start, refresh: refresh, updateParentSubId: updateParentSubId })
            .use(Webcam, {
                id: 'MyWebCam',
                modes: ['picture'],
                mobileNativeCamera: true
            })
            .use(ImageEditor, {
                id: "MyImageEditor",
                quality: 0.8,
            })
            .use(GoogleDrive, { companionUrl: `${COMPANION_URL}` })
            .use(DropBox, { companionUrl: `${COMPANION_URL}` })
            .use(OneDrive, { companionUrl: `${COMPANION_URL}` })
            .use(Url, { companionUrl: `${COMPANION_URL}` })
            .use(GoldenRetriever, { serviceWorker: true })
            ;
        return uppy
    }, [plugins, fileTypes])

    return <>
        {disabled ?
            null :
            <Dashboard
                uppy={uppy}
                plugins={plugins}
                theme={'dark'}
                {...dashProps}
                note={`${fileTypes?.match.join(', ')}`}
                proudlyDisplayPoweredByUppy={false}
            />
        }
    </>
}