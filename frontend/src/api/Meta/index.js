import useAxios from '../useAxios'

const meta_endpoint = "metadata"

export const useMeta = () => {
    const { get, post, put, destroy } = useAxios();

    return {
        get_pipelines: () =>
            get(`${meta_endpoint}/pipelines`),
    }

}
