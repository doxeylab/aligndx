import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container'

import SignInForm from './SignInForm';

const Login = () => {
    return (
        <>
            <Container maxWidth='lg'
                sx={{ marginTop: '5vh' }}
            >
                <Grid container alignItems="center" justifyContent="center" spacing={4}>
                    <Grid item xs={10} sm={4}>
                        <SignInForm />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <img src='assets/SignInImg.svg' alt='SignInImg' />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default Login;