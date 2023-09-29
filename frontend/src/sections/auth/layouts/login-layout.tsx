'use client'

import Image from 'next/image'
import { ReactNode } from 'react'

import { styled } from '@mui/material/styles'
import { Link, Container, Typography, Divider } from '@mui/material'
import { useResponsive } from '@/hooks/use-responsive'
import Logo from '@/components/logo'

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}))

// Optionally, you can also alter the maxWidth of the StyledSection
const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 1px 2.5px 0',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
}))

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}))

interface LoginLayoutProps {
    children: ReactNode
}
export default function LoginPage({ children }: LoginLayoutProps) {
    const mdUp = useResponsive('up', 'md')

    return (
        <>
            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                        width: 150,
                        height: 150,
                    }}
                />

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h2" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Hi, Welcome Back
                        </Typography>
                        <Image
                            src="/assets/login-img.svg"
                            alt="login-img"
                            width={'600'}
                            height={'600'}
                        />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign in to AlignDx
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Don’t have an account? {''}
                            <Link variant="subtitle2">Get started</Link>
                        </Typography>

                        <Divider sx={{ my: 3 }}>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >
                                OR
                            </Typography>
                        </Divider>
                        {children}
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    )
}
