import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import { ReactNode } from 'react'
import Header from '../common/header'

type DenseLayoutProps = {
    children: ReactNode
}

export default function DenseLayout({ children }: DenseLayoutProps) {
    return (
        <>
            <Header />
            <Container component="main">
                <Stack
                    sx={{
                        py: 10,
                        m: 'auto',
                        maxWidth: 500,
                        minHeight: '100vh',
                        textAlign: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {children}
                </Stack>
            </Container>
        </>
    )
}
