// React
import React from 'react';
// Packages
import { Col, Container, Row } from 'react-bootstrap';
// Components
import { Section, Title } from '../../Common/PageElement';
import { TutorialBody, TutorialItem, TutorialText, TutorialTitle } from './StyledTutorial';
import { TutorialContent } from './TutorialContent';

function Tutorial() {
    return (
        <Section id="tutorial">
            <Container>
                <Title align="center">How It Works</Title>
                <Row xs={1} md={3} className="g-4">
                    {TutorialContent.map((item, index) => (
                        <Col key={index}>
                            <TutorialItem>
                                <TutorialBody>
                                    <TutorialTitle>{item.title}</TutorialTitle>
                                    <TutorialText>{item.text}</TutorialText>
                                </TutorialBody>
                            </TutorialItem>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Section>
    )
}

export default Tutorial
