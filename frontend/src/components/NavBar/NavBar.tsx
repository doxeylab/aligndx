import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router'
import { ReactNode } from 'react';

interface NavBarProps {
    pages?: string[];
    children?: ReactNode;
}

function ResponsiveNavBar(props: NavBarProps) {
    const router = useRouter();

    return (
        <AppBar position="static"
        sx={{ marginBottom: '5vh'}}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        <Button
                            onClick={() => { router.push('/') }}
                            sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }}
                        >
                            <img src='assets/icon.png' alt='logo-icon' width="50px" height="auto" />
                            <img src='assets/logo.svg' alt='logo-icon' width="200px" height="auto" style={{ color: 'red' }} />
                        </Button>
                    </Box>
                    {props.children}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveNavBar;