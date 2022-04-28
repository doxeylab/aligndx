import { apiClient } from "./Config"
import {useMutation } from 'react-query'
import { useAuthContext } from "../context/AuthProvider"

const useRefresh = () => {
    const {auth, setAuth} = useAuthContext()

    const refreshreq = (token) => {
        return apiClient.post('/users/refresh', {
            grant_type: "refresh_token",
            refresh_token: token
        })
    }

    const refresh = useMutation(refreshreq, {
        onSuccess: (data) =>{
            let access_token = data.data.accessToken
            setAuth({...auth, access_token: access_token})
            return access_token
        },
        onError: (error) => {
            return error
        }
    })

    return {refresh}
}

export default useRefresh;