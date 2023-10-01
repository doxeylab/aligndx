import getAxiosInstance from "../axiosSingleton";

const submissions_endpoint = "submissions"

export const useSubmissions = () => {
    const axiosInstance = getAxiosInstance()
    const { get, post } = axiosInstance
    return {
        start: (params) =>
            post(`${submissions_endpoint}/start`, params),
        run: (params) =>
            post(`${submissions_endpoint}/run`, params),
        get_submission: (sub_id) =>
            get(`${submissions_endpoint}/${sub_id}`),
        index_submissions: () =>
            get(`${submissions_endpoint}/all/`),
        index_incomplete_submissions: () =>
            get(`${submissions_endpoint}/incomplete/`),
        del_record: (params) =>
            post(`${submissions_endpoint}/delete`, params, {
                withCredentials: true
            }),
        get_report: (sub_id) =>
            get(`${submissions_endpoint}/report/${sub_id}`),
        download: (sub_id) =>
            get(`${submissions_endpoint}/download/${sub_id}`, {
                responseType: 'arraybuffer'
            }),
    }
}
