import { useEffect } from "react"
import { apiClient } from "./Config"

const useAxios = () => {
  useEffect(() => {
    const requestIntercept = apiClient.interceptors.request.use((config) => {
      if (localStorage.getItem("accessToken")) {
        let headers = { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` }
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
      return Promise.reject(error.response.data);
    },
    );

    return () => {
      apiClient.interceptors.request.eject(requestIntercept)
      apiClient.interceptors.response.eject(responseIntercept)
    }
  }, [])

  return apiClient;
}

export default useAxios;