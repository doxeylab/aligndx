import useAxios from '../useAxios'

const meta_endpoint = "metadata"

export const useMeta = () => {
    const { get, post, put, destroy } = useAxios();

    return {
        get_panels: () =>
            get(`${meta_endpoint}/panels`),
    }

}
