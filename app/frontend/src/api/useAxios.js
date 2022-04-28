import { useEffect } from "react"
import { apiClient } from "./Config"
import { useAuthContext } from "../context/AuthProvider"

const useAxios = () => {

  const context = useAuthContext()

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

    const responseIntercept = apiClient.interceptors.response.use((response) => {
      return response;
    }, async (error) => {
      return Promise.reject(error);
    },
    );

    return () => {
      apiClient.interceptors.request.eject(requestIntercept)
      apiClient.interceptors.response.eject(responseIntercept)
    }
  }, [context.authenticated])

  return apiClient;
}

export default useAxios;