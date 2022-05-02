import useAxios from '../useAxios'

const results_endpoint = "results"

export const useResults = () => {
    const {get, post, put, destroy } = useAxios();

    return {
        get_standard: () =>
            get(`${results_endpoint}/standard`),
        get_chunked: () =>
            get(`${results_endpoint}/chunked`)
    }
}
