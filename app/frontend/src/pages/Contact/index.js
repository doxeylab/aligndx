import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Section, Title } from '../../components/Common/PageElement';
import { ContactIcon, ContactInfo, ContactItem, ContactText, ContactTitle, ContactWrapper, Header } from './ContactElement';

const Contact = () => {
    return (
        <Section id="contact" center full>
            <Container>
                <Row>
                    <Col>
                        <Title>Get in Touch</Title>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Header>Have any concerns or questions? Get in touch and let us know how we can help!</Header>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ContactWrapper>
                            <ContactItem>
                                <ContactIcon>
                                    <FaMapMarkerAlt />
                                </ContactIcon>
                                <ContactText>
                                    <ContactTitle>Address</ContactTitle>
                                    <ContactInfo>200 University Ave W, Waterloo, ON N2L 3G1</ContactInfo>
                                </ContactText>
                            </ContactItem>
                            <ContactItem>
                                <ContactIcon>
                                    <FaPhone />
                                </ContactIcon>
                                <ContactText>
                                    <ContactTitle>Phone</ContactTitle>
                                    <ContactInfo>519-888-4567</ContactInfo>
                                </ContactText>
                            </ContactItem>
                            <ContactItem>
                                <ContactIcon>
                                    <FaEnvelope />
                                </ContactIcon>
                                <ContactText>
                                    <ContactTitle>Email</ContactTitle>
                                    <ContactInfo>acdoxey@uwaterloo.ca</ContactInfo>
                                </ContactText>
                            </ContactItem>
                        </ContactWrapper>
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default Contact;

