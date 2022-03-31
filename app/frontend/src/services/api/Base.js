import axios from "axios"
import { URL } from "../../config/Settings"

const apiClient = axios.create({
    baseURL: URL,
})

apiClient.interceptors.request.use((config) => {
    const headers = {}
    
    if (localStorage.getItem("accessToken")) {
        headers.append("Authorization", "Bearer " + localStorage.getItem("accessToken"));
    }

    return ({
      ...config,
      headers: {
          headers
      },
    })
  },
    error => Promise.reject(error),
  );
  
  apiClient.interceptors.response.use((response) =>
    response,
    async (error) => {
      return Promise.reject(error.response.data);
    },
  );
  
  const { get, post, put, delete: destroy } = apiClient;
  export { get, post, put, destroy };