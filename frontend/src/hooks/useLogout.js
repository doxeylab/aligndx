import { useUsers } from "../api/Users";
import { useAuthContext } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";


const useLogout = () => {
    const users = useUsers();
    const { setAuth } = useAuthContext();

    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        users.logout()
        setAuth({})
        navigate('/login', { state: { from: location }, replace: true });
    }

    return { logout }

}

export default useLogout;