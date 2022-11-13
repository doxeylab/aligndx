import { useAuthContext } from "../context/AuthProvider";
import { useRouter } from "next/router";

import axios from "axios";
import { URL } from "../config/Settings"

const useLogout = () => {
    const { setAuth } = useAuthContext();
    const router = useRouter();

    const logout = async() => {
        try {
            // destroy refresh token
            const response = await axios.get(`${URL}users/logout`, { withCredentials: true })
            setAuth({})
            router.push('/login');
            return
        }
        catch (err) {
            return err
        }
    }

    return { logout }

}

export default useLogout;