import { Section } from '../../components/Common/PageElement';
import { LogInForm } from '../../containers/Authentication'

import Fade from 'react-reveal/Fade';
import { Grid, Container } from '@mui/material';

import LoginImg from "../../assets/LoginImg.svg";

const Login = () => {
    return (
        <>
            <Section center id="login">
                <Container> 
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item xs={10} sm={4}>
                            <Fade left duration={1000} delay={600} distance="30px">
                                <LogInForm />
                            </Fade>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Fade right duration={1000} delay={600} distance="30px">
                                <img src={LoginImg} alt='loginImg' />
                            </Fade>
                        </Grid>
                    </Grid>
                </Container>
            </Section>
        </>
    );
}

export default Login;