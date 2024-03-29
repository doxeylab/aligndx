import getAxiosInstance from "../axiosSingleton";

const users_endpoint = "users"

export const useUsers = () => {
    const axiosInstance = getAxiosInstance()
    const { get, post } = axiosInstance

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
    }

}
