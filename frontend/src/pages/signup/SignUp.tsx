import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"

import SignUpForm from "./SignUpForm";

const SignUp = () => {
    return (
        <>
            <Container maxWidth='lg'
                sx={{ marginTop: '5vh' }}
            >
                <Grid container alignItems="center" justifyContent="center" spacing={4}>
                    <Grid item xs={12} sm={8} md={6}>
                        <SignUpForm />
                    </Grid>
                    <Grid item xs={0} sm={0} md={6}>
                        <img src='assets/SignUpImg.svg' alt='SignUpImg' />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default SignUp;