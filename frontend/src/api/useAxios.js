import { useEffect } from 'react'
import { apiClient } from './Config'
import { useAuthContext } from '@/context/auth-context'
import useRefresh from './useRefresh'

const useAxios = () => {
    const context = useAuthContext()
    const { refresh } = useRefresh()

    useEffect(() => {
        const requestIntercept = apiClient.interceptors.request.use(
            (config) => {
                if (context?.authenticated) {
                    if (!config.headers['Authorization']) {
                        config.headers[
                            'Authorization'
                        ] = `Bearer ${context.auth.accessToken}`
                    }
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        const responseIntercept = apiClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (context?.authenticated) {
                    const prevRequest = error?.config
                    if (error?.response?.status === 401 && !prevRequest?.sent) {
                        prevRequest.sent = true
                        const newAccessToken = await refresh()
                        if (typeof newAccessToken === 'string') {
                            prevRequest.headers[
                                'Authorization'
                            ] = `Bearer ${newAccessToken}`
                            return apiClient(prevRequest)
                        }
                    }
                }
                return Promise.reject(error)
            }
        )

        return () => {
            apiClient.interceptors.request.eject(requestIntercept)
            apiClient.interceptors.response.eject(responseIntercept)
        }
    }, [context?.auth, refresh])

    return apiClient
}

export default useAxios
