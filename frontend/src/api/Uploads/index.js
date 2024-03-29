import getAxiosInstance from "../axiosSingleton";

const uploads_endpoint = "uploads"

export const useUploads = () => {
    const axiosInstance = getAxiosInstance()
    const { post } = axiosInstance
    
    return {
        start: (params) =>
            post(`${uploads_endpoint}/start`, params),
        start_file: (params) =>
            post(`${uploads_endpoint}/start-file`, params),
        upload_chunk: (params) =>
            post(`${uploads_endpoint}/upload-chunk`, params, {
                "Content-Type": "multipart/form-data",
                "Content-Encoding": "gzip",
            }),
        end_file: (params) =>
            post(`${uploads_endpoint}/end-file`, params),
    }

}
