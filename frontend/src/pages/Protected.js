import {useLocation, Navigate, Outlet} from 'react-router-dom'
import {useAuthContext} from '../context/AuthProvider'

const Protected = () => {
    const { authenticated } = useAuthContext();
    const location = useLocation();

    return (
        <>
        {authenticated ? 
        <Outlet />
        :
        <Navigate to="/login" state={{ from: location }} replace />
        }
        </>
    )
}

export default Protected; 