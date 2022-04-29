import { useAuthContext } from "../context/AuthProvider"

import { URL } from "../config/Settings"
import axios from "axios"

const useRefresh = () => {
    const { setAuth, logout } = useAuthContext();

    const refresh = async (token) => {
        try {
            const response = await axios.post(`${URL}users/refresh`, {
                grant_type: "refresh_token",
                refresh_token: token
            })
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