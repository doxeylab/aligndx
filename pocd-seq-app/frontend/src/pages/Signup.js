// React
import React from "react";
// Components
import { Section } from '../components/PageElement';
import { Container, Row, Col } from 'react-bootstrap';
import {SignUpAuth} from '../components/Authentication';
// Assets
import SignUpImg from "../assets/SignUpImg.svg";

const SignUp = () => {
    return (
        <Section center id="signup">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={5}>
                        <SignUpAuth/>
                    </Col>
                    <Col md={{ span: 5, offset: 1 }}>
                        <img src={SignUpImg} alt='SignUpImg' />
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default SignUp;