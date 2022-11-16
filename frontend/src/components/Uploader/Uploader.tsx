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

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import '@uppy/image-editor/dist/style.css'


interface UploaderProps {
    plugins?: string[];
    [dashProps:string] :any;
}

const COMPANION_URL = "http://companion.uppy.io";
const TUS_ENDPOINT = "https://tusd.tusdemo.net/files/";

export default function Uploader(props: UploaderProps) {
    const { plugins, ...dashProps } = props

    const uppy = new Uppy({
        id: "uppy1",
        autoProceed: false,
        debug: true
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
        .use(Url, { companionUrl: COMPANION_URL });

    return (
        <Dashboard
            uppy={uppy}
            plugins={
                plugins ?
                    plugins
                    :
                    ["GoogleDrive", "MyWebCam", "OneDrive", "Dropbox", "Url", "MyImageEditor"]
            }
            {...dashProps}
            proudlyDisplayPoweredByUppy={false}
            metaFields={[{ id: "name", name: "Name", placeholder: "File name" }]}
        />
    );
}
