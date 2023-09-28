import useAxios from '../useAxios'

const endpoint = 'workflows'

export const useMeta = () => {
    const { get, post, put, destroy } = useAxios()

    return {
        get_workflows: () => get(`${endpoint}/`),
        get_workflow: (id) => get(`${endpoint}/${id}`),
    }
}
