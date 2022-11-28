import { useUsers } from "../api/Users";
import { useAuthContext } from "../context/AuthProvider";
import { useRouter } from "next/router";

const useLogout = () => {
    const users = useUsers();
    const { setAuth } = useAuthContext();
    const router = useRouter();

    const logout = () => {
        users.logout()
        setAuth({})
        router.reload()
        router.push('/signin')
    }

    return { logout }

}

export default useLogout;