/* eslint-disable */
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import GoogleDrive from "@uppy/google-drive";
import Url from "@uppy/url";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import GoldenRetriever from '@uppy/golden-retriever'
import { COMPANION_URL } from '../../config/Settings'
import { TUS_ENDPOINT } from '../../config/Settings'

interface UppyFactoryProps {
    id: string;
    meta?: Record<string, unknown>;
    fileTypes?: string[];
    refresh: any;
}

export default function UppyFactory({ id, meta, fileTypes, refresh }: UppyFactoryProps) {
    const uppy = new Uppy({
        id: id,
        autoProceed: false,
        allowMultipleUploadBatches: false,
        restrictions: {
            maxFileSize: null,
            maxTotalFileSize: null,
            maxNumberOfFiles: null,
            allowedFileTypes: (fileTypes ? fileTypes : null),
        },
        meta: (meta ? meta : {}),
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
        .use(Url, { companionUrl: `${COMPANION_URL}` })
        .use(GoldenRetriever, { serviceWorker: true })
    return uppy
}