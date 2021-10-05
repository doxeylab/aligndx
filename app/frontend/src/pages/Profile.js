import React from 'react';

import {Section, Title} from '../components/PageElement';
import ResultCardComponent from '../components/ResultCardComponent';
import {ResultHeader} from '../components/ProfileComponents/StyledProfile';
import { Container, Row, Col } from 'react-bootstrap';

const Profile = () => {
    return (
        <Section id="profile">
            <Container>
                <Row>
                    <Col>
                        <Title>Your Saved Results</Title>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ResultHeader>
                            <h1 style={{margin: 0, fontSize: "1.2rem"}}>
                                File Name
                            </h1>
                            <h1 style={{textAlign: "center", margin: 0, fontSize: "1.2rem"}}>
                                Upload Date
                            </h1>
                            <h1 style={{textAlign: "center", margin: 0, fontSize: "1.2rem"}}>
                                Pathogen Type
                            </h1>
                            <span></span>
                        </ResultHeader>
                        <ResultCardComponent></ResultCardComponent>
                        <ResultCardComponent></ResultCardComponent>
                        <ResultCardComponent></ResultCardComponent>
                        <ResultCardComponent></ResultCardComponent>
                        <ResultCardComponent></ResultCardComponent>
                        <ResultCardComponent></ResultCardComponent>
                        <ResultCardComponent></ResultCardComponent>
                    </Col>
                </Row>
            </Container>
        </Section>
    )
}

export default Profile