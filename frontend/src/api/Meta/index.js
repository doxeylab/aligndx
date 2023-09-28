import useAxios from '../useAxios'

const meta_endpoint = 'workflows'

export const useMeta = () => {
    const { get, post, put, destroy } = useAxios()

    return {
        get_pipelines: () => get(`${meta_endpoint}/`),
    }
}
