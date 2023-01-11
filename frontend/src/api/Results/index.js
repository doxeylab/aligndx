import useAxios from '../useAxios'

const results_endpoint = "results"

export const useResults = () => {
    const {get, post, put, destroy } = useAxios();

    return {
        get_status: (sub_id) =>
            get(`${results_endpoint}/status/${sub_id}`),
        get_report: (sub_id) =>
            get(`${results_endpoint}/report/${sub_id}`),
        download: (sub_id) =>
            get(`${results_endpoint}/download/${sub_id}`, {
                responseType: 'arraybuffer'
            })
    }
}
