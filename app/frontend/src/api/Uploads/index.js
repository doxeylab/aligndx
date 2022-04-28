import useAxios from '../useAxios'

const uploads_endpoint = "uploads"

export const useUploads = () => {
    const { get, post, put, destroy } = useAxios();

    return {
        start_file: (params) =>
            post(`${uploads_endpoint}/start-file`, params),
        upload_chunk: (params) =>
            post(`${uploads_endpoint}/upload-chunk`, params),
        end_file: (params) =>
            post(`${uploads_endpoint}/end-file`, params),
    }

}
