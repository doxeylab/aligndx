import { useAuthContext } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import { URL } from "../config/Settings"

const useLogout = () => {
    const { setAuth } = useAuthContext();

    const navigate = useNavigate();
    const location = useLocation();

    const logout = async() => {
        try {
            // destroy refresh token
            const response = await axios.get(`${URL}users/logout`, { withCredentials: true })
            setAuth({})
            navigate('/login', { state: { from: location }, replace: true });
            return
        }
        catch (err) {
            return err
        }
    }

    return { logout }

}

export default useLogout;