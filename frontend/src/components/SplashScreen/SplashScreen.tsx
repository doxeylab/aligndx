import { useState, useEffect } from 'react'
import Logo from '../Logo'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export default function SplashScreen() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <Box
            sx={{
                right: 0,
                width: 1,
                bottom: 0,
                height: 1,
                zIndex: 9998,
                display: 'flex',
                position: 'fixed',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
            }}
        >
            <Box
                sx={{
                    position: 'relative', // to make Box a stacking context
                    width: '100px',
                    height: '100px',
                }}
            >
                <CircularProgress
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        margin: 'auto',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Logo />
                </Box>
            </Box>
        </Box>
    )
}
