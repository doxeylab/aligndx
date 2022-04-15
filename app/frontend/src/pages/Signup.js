import React from "react";
import Fade from 'react-reveal/Fade';
import SignUpImg from "../assets/SignUpImg.svg";
import { SignUpForm } from "../containers/Authentication";
import { Section } from '../components/Common/PageElement';
import { Grid, Container } from '@mui/material';

const SignUp = () => {
    return (
        <Section center id="signup">
            <Container>
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={5}>
                        <Fade left duration={1000} delay={600} distance="30px">
                            <SignUpForm />
                        </Fade>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Fade right duration={1000} delay={600} distance="30px">
                            <img src={SignUpImg} alt='SignUpImg' />
                        </Fade>
                    </Grid>
                </Grid>
            </Container>
        </Section>
    );
}

export default SignUp;