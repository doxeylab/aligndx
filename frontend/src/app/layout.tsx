import ThemeProvider from '@/config/theme'
import { AuthProvider } from '@/context/auth-context'
import QueryProvider from '@/context/query-context'

export const metadata = {
    title: 'AlignDx',
    description: 'Welcome to the AlignDx Platform',
    keywords: 'bioinformatics,surveillance',
    manifest: '/manifest.json',
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
    icons: [
        {
            rel: 'icon',
            url: '/favicon/favicon.ico',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            url: '/favicon/favicon-16x16.png',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            url: '/favicon/favicon-32x32.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            url: '/favicon/apple-touch-icon.png',
        },
    ],
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <>
            <AuthProvider>
                <ThemeProvider>
                    <QueryProvider>{children}</QueryProvider>
                </ThemeProvider>
            </AuthProvider>
        </>
    )
}
