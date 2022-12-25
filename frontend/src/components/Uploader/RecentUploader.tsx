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
import RemoteSources from "@uppy/remote-sources";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import '@uppy/image-editor/dist/style.css'
import { useEffect, useState, useRef } from "react";
import { COMPANION_URL } from '../../config/Settings'
import { TUS_ENDPOINT } from '../../config/Settings'
import { useMutation } from '@tanstack/react-query'

import useRefresh from "../../api/useRefresh"
import { useUploads } from "../../api/Uploads"
import CreateSubmission from "./CreateSubmission";
import test from "node:test";


interface UploaderProps {
    id: string;
    meta?: Record<string, unknown>;
    plugins?: string[];
    fileTypes?: string[];
    [dashProps: string]: any;
}


export default function Uploader(props: UploaderProps) {
    const { id, meta, plugins, fileTypes, ...dashProps } = props
    const [uppy, setUppy] = useState(() => new Uppy());


    const { refresh } = useRefresh();
    const uploads = useUploads();

    // mutation function used to start uploads
    const sendStart = (data) => {
        return uploads.start(data)
    }

    const start = useMutation({
        mutationFn: sendStart,
        // retry: 1,
        // retryDelay: 1000,
    })

    const parse = (value: string) => {
        try {
            return JSON.parse(value)
        } catch {
            return value
        }
    }

    useEffect(() => {
        return () => {
            // you are in control whether you want to cancel uploads or not.
            uppy.close({ cancelUploads: false });
        };
    }, []);

    useEffect(() => {
        const uppy_obj = new Uppy({
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
            meta: (meta ? meta : {}),
        })
            .use(Tus, {
                limit: 10,
                endpoint: TUS_ENDPOINT,
                retryDelays: [1000],
                async onBeforeRequest(req) {
                    const stored = parse(localStorage.getItem('auth'))
                    const token = stored['accessToken']

                    req.setHeader('Authorization', `Bearer ${token}`)
                },
                onShouldRetry(err, retryAttempt, options, next) {
                    const status = err?.originalResponse?.getStatus()
                    if (status === 401) {
                        return true
                    }
                    return next(err)
                },
                async onAfterResponse(req, res) {
                    if (res.getStatus() === 401) {
                        await refresh()
                    }
                },
            })
            .use(Webcam, {
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
            .use(GoldenRetriever, { serviceWorker: true })
        setUppy(uppy_obj)

    }, [fileTypes, plugins])

    uppy.setOptions({
        onBeforeUpload: (files) => {

            let names = Object.values(files).map(a => a.name);
            let data = {
                "items": names,
                'pipeline': meta.pipeline
            }
            start.mutate(data)

            
            async function test() {
                await new Promise(resolve => setTimeout(resolve, 1000));
                start.mutate(data)
            }

            if (start.isError) {
                start.reset()
                test()
            }

            if (start.isSuccess) {
                console.log('success')
                let subId = start.data.data.sub_id
                console.log(subId)
                uppy.setOptions({
                    meta: {
                        ...meta,
                        'sub_id': subId
                    }
                })
            }

        }
    })

    return <>
        {uppy ?
            <Dashboard
                uppy={uppy}
                plugins={plugins
                    // plugins ?
                    // plugins
                    // :
                    // ["GoogleDrive", "MyWebCam", "OneDrive", "Dropbox", "Url", "MyImageEditor"]
                }
                theme={'dark'}
                {...dashProps}
                proudlyDisplayPoweredByUppy={false}
            // metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
            />
            :
            null}
    </>
}