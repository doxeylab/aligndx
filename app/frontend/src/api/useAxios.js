import { useEffect } from "react"
import { apiClient } from "./Config"
import { useAuthContext } from "../context/AuthProvider"
import useRefresh from "./useRefresh"

const useAxios = () => {

  const context = useAuthContext()
  const { refresh } = useRefresh();

  useEffect(() => {
    const requestIntercept = apiClient.interceptors.request.use((config) => {
      if (context.authenticated) {
        let headers = { "Authorization": `Bearer ${context.auth.accessToken}` }
        return ({
          ...config,
          headers: headers
        })
      }
      else {
        return ({
          ...config,
        })
      }
    },
      error => Promise.reject(error),
    );

    const responseIntercept = apiClient.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;
        console.log(prevRequest)
        if (error?.response?.status === 401 && !prevRequest?.sent && prevRequest.headers['Authorization']) {
          prevRequest.sent = true;
          const newAccessToken = refresh.mutate(context.auth.refreshToken);
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestIntercept)
      apiClient.interceptors.response.eject(responseIntercept)
    }
  }, [context.authenticated])

  return apiClient;
}

export default useAxios;