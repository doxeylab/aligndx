import { get, post, put, destroy } from '../Base'

const users_endpoint = "users"

export const Users = {
    login: (params) => 
        post(`${users_endpoint}/token`, params),
    signup: (params) => 
        post(`${users_endpoint}/create_user`, params),
    me: () => 
        get(`${users_endpoint}/me`),
    index_submissions: () => 
        get(`${users_endpoint}/submissions`),
    index_incomplete_submissions: () => 
        get(`${users_endpoint}/incomplete`),
    linked_results: () => 
        get(`${users_endpoint}/linked_results`)
}
