import React from "react";
import { Col, Container, Row } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import SignUpImg from "../assets/SignUpImg.svg";
import { SignUpAuth } from '../components/Authentication';
import { Section } from '../components/PageElement';

const SignUp = () => {
    return (
        <Section center id="signup">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={5}>
                        <Fade left duration={1000} delay={600} distance="30px">
                            <SignUpAuth />
                        </Fade>
                    </Col>
                    <Col md={{ span: 5, offset: 1 }} style={{ display: 'flex', alignItems: 'center' }}>
                        <Fade right duration={1000} delay={600} distance="30px">
                            <img src={SignUpImg} alt='SignUpImg' />
                        </Fade>
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default SignUp;