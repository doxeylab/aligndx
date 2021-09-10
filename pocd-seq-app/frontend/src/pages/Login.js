// React
import React from 'react';
// Components
import { Section } from '../components/PageElement';
import { Container, Row, Col } from 'react-bootstrap';
import { LogInAuth } from '../components/Authentication';
// Assets
import LoginImg from "../assets/LoginImg.svg";

const Login = () => {
    return (
        <Section center full id="login">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={5}>
                        <LogInAuth />
                    </Col>
                    <Col md={{ span: 5, offset: 1 }} style={{display: 'flex', alignItems: 'center'}}>
                        <img src={LoginImg} alt='loginImg' />
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default Login;