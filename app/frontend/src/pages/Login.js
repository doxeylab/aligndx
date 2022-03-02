import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import LoginImg from "../assets/LoginImg.svg";
import { LogInAuth } from '../components/Authentication';
import { Section } from '../components/Common/PageElement';
import { useState } from 'react';
import { FormContainer } from '../components/Authentication/StyledForm';
import { useHistory, useLocation } from 'react-router-dom';

import { Alert, Box, IconButton, Collapse} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Login = () => {

    const [link,setLink] = useState("/");
    const [showAlert, setShowAlert] = useState(false);
    const location = useLocation()

    useEffect(()=>{
        if (location.state){
            setLink(location.state.link)
            setShowAlert(true)
        }
    },[])
 
    return (
        <>
        <Section center id="login">
            <Container>
                {showAlert? 
                <Row>
                    <Col md={6}>
                    </Col>
                    <Col md={{ span: 5, offset: 1 }} style={{ display: 'flex', alignItems: 'center' }}>
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
                                    <CloseIcon fontSize="inherit"/>
                                </IconButton>
                            }>You're not logged in! Please Log in to see your results.</Alert>
                        </Fade>
                        </Collapse>
                    </Col>
                </Row>
                :
                null}
                <Row className="justify-content-md-center">
                    <Col md={5}>
                        <Fade left duration={1000} delay={600} distance="30px">
                            <FormContainer>
                                <LogInAuth link={link} />
                            </FormContainer>
                        </Fade>
                    </Col>
                    <Col md={{ span: 5, offset: 1 }} style={{ display: 'flex', alignItems: 'center' }}>
                        <Fade right duration={1000} delay={600} distance="30px">
                            <img src={LoginImg} alt='loginImg' />
                        </Fade>
                    </Col>
                </Row>
            </Container>
        </Section>
        </>

    );
}

export default Login;