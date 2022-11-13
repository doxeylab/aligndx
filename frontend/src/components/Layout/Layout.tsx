import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import NavBar from '../NavBar';
import ProfileButton from './ProfileButton';
import Button from '@mui/material/Button';
import { useAuthContext } from "../../context/AuthProvider";

const Layout = (props: any) => {
    const router = useRouter();
    const settings = ['Settings', 'Logout'];
    const context = useAuthContext();

    const dynamicview = () => {
        if (context.auth) {
            return (
                <Box sx={{ flexGrow: 0 }}>
                    <ProfileButton settings={settings} />
                </Box>
            )
        }
        else {
            if (router.route !== '/signin') {
                return (
                    <Box sx={{ flexGrow: 0 }}>
                        <Button variant="contained" onClick={() => { router.push('/signin') }}> Sign In </Button>
                    </Box>
                )
            }
        }

    }
    return (
        <>
            <NavBar>
                {dynamicview()}
            </NavBar>
            {props.children}
        </>
    )
};

export default Layout;