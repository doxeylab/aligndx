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
    const temp = Array.from(fileTypes, (element) => {
        if (element.includes('.')) {
            const split_extensions = element.split('.').filter(i => i != '')
            let new_extensions = []
            if (split_extensions.length > 1) {
                new_extensions = ['.' + split_extensions[0], '.' + split_extensions[1]]
            }
            else {
                new_extensions = ['.' + split_extensions[0]]
            }
            return new_extensions
        }
        else {
            return element
        }
    })
    const allowed_extensions = [...new Set(temp.flat())]
    const doubledots = fileTypes.filter(e => e.includes('.'))
    console.log(doubledots)
    console.log(fileTypes)
    
    const uppy = new Uppy({
        id: id,
        autoProceed: false,
        allowMultipleUploadBatches: false,
        restrictions: {
            maxFileSize: null,
            maxTotalFileSize: null,
            maxNumberOfFiles: null,
            allowedFileTypes: (fileTypes ? allowed_extensions : null),
        },
        meta: (meta ? meta : {}),
        infoTimeout: 6000,
        onBeforeFileAdded: (currentFile: any, files: any) => {
            if (doubledots.length > 0) {
                if (doubledots.some((s: string) => currentFile.name.endsWith(s)) != true) {
                    // log to console
                    uppy.log(`Invalid filetype`)
                    // show error message to the user
                    uppy.info(`Invalid filetype`, 'error', 500)
                    return false
                }
            }
        }
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