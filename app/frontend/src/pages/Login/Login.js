import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Section } from '../../components/Common/PageElement';
import { LogInForm } from '../../containers/Authentication'

import Fade from 'react-reveal/Fade';
import { Alert, Box, IconButton, Collapse } from '@mui/material';
import { Grid, Container } from '@mui/material';

import LoginImg from "../../assets/LoginImg.svg";
import CloseIcon from '@mui/icons-material/Close';

const Login = () => {

    const [link, setLink] = useState("/");
    const location = useLocation()

    return (
        <>
            <Section center id="login">
                <Container>
                    {/* {showAlert ?
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item xs={4}>
                                <Collapse in={showAlert}>

                                    <Fade right duration={1000} delay={600} distance="30px">
                                        <Alert severity='info' variant='filled' action={
                                            <IconButton
                                                aria-label='close'
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setShowAlert(false);
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }>You're not logged in! Please Log in to see your results.</Alert>
                                    </Fade>
                                </Collapse>

                            </Grid>
                        </Grid>
                        :
                        null} */}
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