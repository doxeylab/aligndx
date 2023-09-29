import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/auth-context'

import axios from 'axios'
import { BACKEND_URL } from '../config/Settings'

const useLogout = () => {
    const { setAuth } = useAuthContext()
    const router = useRouter()

    const logout = async () => {
        try {
            // destroy refresh token
            const response = await axios.get(`${BACKEND_URL}users/logout`, {
                withCredentials: true,
            })
            setAuth({})
            router.push('/signin')
            return
        } catch (err) {
            return err
        }
    }

    return { logout }
}

export default useLogout
