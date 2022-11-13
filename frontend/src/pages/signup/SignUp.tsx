import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"

import SignUpForm from "./SignUpForm";

const SignUp = () => {
    return (
        <>
            <Container maxWidth='lg'>
                <Grid container alignItems="center" justifyContent="center" spacing={4}>
                    <Grid item xs={11} sm={5}>
                        <SignUpForm />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <img src='assets/SignUpImg.svg' alt='SignUpImg' />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default SignUp;