import getAxiosInstance from "../axiosSingleton";

const meta_endpoint = "metadata"

export const useMeta = () => {
    const axiosInstance = getAxiosInstance()
    const { get } = axiosInstance

    return {
        get_pipelines: () =>
            get(`${meta_endpoint}/pipelines`),
    }

}
