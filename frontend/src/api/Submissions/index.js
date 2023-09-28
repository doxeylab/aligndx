import useAxios from '../useAxios'

const endpoint = 'submissions'

export const useSubmissions = () => {
    const { get, post, patch, destroy } = useAxios()

    return {
        get_submissions: () => get(`${endpoint}/`),
        get_submission: (sub_id) => get(`${endpoint}/${sub_id}`),
        create_submission: (params) => post(`${endpoint}/`, params),
        delete_submissions: (params) => destroy(`${endpoint}/`, params),
        delete_submission: (params) => destroy(`${endpoint}/`, params),
        run_submission: (sub_id, params) =>
            patch(`${endpoint}/${sub_id}/run`, params),
        get_report: (sub_id) => get(`${endpoint}/${sub_id}/report`),
    }
}
