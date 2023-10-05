import { useAuthContext } from '../context/AuthProvider'
import { useRouter } from 'next/router';
import NotFound from '../pages/404';
import { ReactNode } from 'react';
interface ProtectedProps {
    children: ReactNode;
    pages: string[];
}

const Protected = (props: ProtectedProps) => {
    const { children, pages } = props
    const { authenticated } = useAuthContext();
    const router = useRouter(); 
    return (
        <>
            {authenticated ?
                children
                :
                pages.includes(router.pathname) ?
                    <NotFound />
                    :
                    children
            }
        </>
    )
}

export default Protected;