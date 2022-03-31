import { get, post, put, destroy } from '../Base'

const results_endpoint = "results/"

export const Result = {
    get_standard: () => 
        get(`${results_endpoint}/standard`),
    get_chunked: () => 
        get(`${results_endpoint}/chunked`)
}
