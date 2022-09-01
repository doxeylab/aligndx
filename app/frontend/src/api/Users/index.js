import useAxios from '../useAxios'

const users_endpoint = "users"

export const useUsers = () => {
    const { get, post, put, delete: destroy } = useAxios();

    return {
        login: (params) =>
            post(`${users_endpoint}/token`, params, {
                withCredentials: true
            }),
        signup: (params) =>
            post(`${users_endpoint}/create_user`, params),
        refresh: (params) =>
            post(`${users_endpoint}/refresh`, params),
        logout: () =>
            get(`${users_endpoint}/logout`, {
                withCredentials: true
            }),
        me: () =>
            get(`${users_endpoint}/me`),
        index_submissions: () =>
            get(`${users_endpoint}/submissions`),
        index_incomplete_submissions: () =>
            get(`${users_endpoint}/incomplete`),
        linked_results: (params) =>
            get(`${users_endpoint}/linked_results/${params}`),
        del_record: (params) =>
            post(`${users_endpoint}/delete_record`, params, {
                withCredentials: true
            }),
    }

}
