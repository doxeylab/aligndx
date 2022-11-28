import { useAuthContext } from "../context/AuthProvider"
import useLogout from "./useLogoutCustom"

import { BACKEND_URL } from "../config/Settings"
import axios from "axios"

const useRefresh = () => {
    const { setAuth } = useAuthContext();
    const {logout} = useLogout();
    const refresh = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}users/refresh`,{withCredentials: true})
            setAuth(prev => {
                return { ...prev, accessToken: response.data.access_token }
            })
            return response.data.access_token
        }
        catch (err) {
            logout()
            return err
        }
    }

    return { refresh }
}

export default useRefresh;