import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import LoginImg from "../assets/LoginImg.svg";
import { LogInAuth } from '../components/Authentication';
import { Section } from '../components/PageElement';

const Login = () => {
    return (
        <Section center id="login">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={5}>
                        <Fade left duration={1000} delay={600} distance="30px">
                            <LogInAuth />
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
    );
}

export default Login;