import { useAuthContext } from '../context/AuthProvider'
import { useRouter } from 'next/router';
import NotFound from '../pages/404';
import { ReactNode } from 'react';
import { SplashScreen } from './SplashScreen';
interface ProtectedProps {
    children: ReactNode;
    pages: string[];
}

const Protected = (props: ProtectedProps) => {
    const { children, pages } = props
    const { authenticated, loading } = useAuthContext();
    const router = useRouter();
    if (loading) {
        return <SplashScreen />;
    }

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