import { useAuthContext } from '../context/AuthProvider'
import { useRouter } from 'next/router'
import NotFound from '../pause_pages/404'
import { ReactNode } from 'react'

interface ProtectedProps {
    children: ReactNode
    pages: string[]
}

const Protected = (props: ProtectedProps) => {
    const { children, pages } = props
    const context = useAuthContext()
    const router = useRouter()

    return (
        <>
            {context?.authenticated ? (
                children
            ) : pages.includes(router.pathname) ? (
                <NotFound />
            ) : (
                children
            )}
        </>
    )
}

export default Protected
