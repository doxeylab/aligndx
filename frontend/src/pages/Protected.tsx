import {useAuthContext} from '../context/AuthProvider'
import { useRouter } from 'next/router';
import Dashboard from './dashboard';
import NotFound from './404';

const Protected = ({children}) => {
    const { authenticated } = useAuthContext();
    const router = useRouter(); 

    return (
        <>
        {authenticated ? 
        <Dashboard />
        :
        <NotFound />
        }
        </>
    )
}

export default Protected; 