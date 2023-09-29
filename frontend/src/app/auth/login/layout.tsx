import { LoginLayout as ModuleLoginLayout } from '@/sections/auth'

type Props = {
    children: React.ReactNode
}

export default function LoginLayout({ children }: Props) {
    return <ModuleLoginLayout>{children}</ModuleLoginLayout>
}
