import { useState, useEffect } from 'react';
import Logo from '../Logo';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function SplashScreen() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const customThickness = 1;
    const thickness = 3.6;
    const logoSize = 100;
    const extraOffset = 5;
    const progressSize = logoSize + 2 * (thickness + extraOffset);

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
                    position: 'relative',
                    width: `${progressSize}px`,
                    height: `${progressSize}px`,
                }}
            >
                <CircularProgress
                    thickness={customThickness}
                    size={progressSize}
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
                        top: thickness + extraOffset,
                        left: thickness + extraOffset,
                        width: `${logoSize}px`,
                        height: `${logoSize}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Logo />
                </Box>
            </Box>
        </Box>
    );
}
