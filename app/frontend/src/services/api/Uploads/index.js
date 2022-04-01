import { get, post, put, destroy } from '../Base'

const uploads_endpoint = "uploads"

export const Uploads = {
    start_file: (params) =>
        post(`${uploads_endpoint}/start-file`, params),
    upload_chunk: (params) =>
        post(`${uploads_endpoint}/upload-chunk`, params),
    end_file: (params) =>
        post(`${uploads_endpoint}/end-file`, params),
}
