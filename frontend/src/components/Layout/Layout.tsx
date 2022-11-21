import { useRouter } from 'next/router'
import { useAuthContext } from "../../context/AuthProvider";
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Navigation from '../Navigation';
import ProfileButton from '../ProfileButton';
import LogoButton from '../LogoButton';

const Layout = (props: any) => {
    const router = useRouter();
    const settings = ['Settings', 'Logout'];
    const context = useAuthContext();

    const sharedView = (
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <LogoButton />
        </Box>
    )
    const userView = (
        <>
            {sharedView}
            <Box sx={{ flexGrow: 0 }}>
                <ProfileButton settings={settings} />
            </Box>
        </>
    )
    const anonView = (
        <>
            {sharedView}
            <Stack spacing={2} direction="row">
                <Button onClick={() => { router.push('/signin') }}> Sign In </Button>
                <Button variant="contained" onClick={() => { router.push('/signup') }}> Sign Up </Button>
            </Stack>
        </>
    )
    const dynamicNav = () => {
        if (context?.authenticated) {
            return (
                <>
                    <Navigation
                        sidebar
                        topbarItems={userView}
                    >
                        {props.children}
                    </Navigation>
                </>

            )
        }
        else {
            return (
                <>
                    <Navigation
                        topbarItems={anonView}
                    >
                        {props.children}
                    </Navigation>
                </>
            )
        }
    }

    return (
        <>
            <div className='wrap-layer'>
                <img className='bg-image' src='assets/bg_top.svg' />
                <div className='content-layer'>
                    {dynamicNav()}
                </div>
            </div>
        </>
    )
};

export default Layout;