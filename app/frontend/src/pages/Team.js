import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import Doxey from '../assets/Team/ADoxey.png';
import Carson from '../assets/Team/Carson.jpg';
import Hirota from '../assets/Team/JHirota.png';
import Linda from '../assets/Team/Linda.jpeg';
import Manjot from '../assets/Team/Manjot.png';
import William from '../assets/Team/William.png';
import { Section, Title } from '../components/Common/PageElement';
import TeamCard from '../components/TeamCard';

const Team = () => {
  return (
    <Section>
      <Container>
        <Title>Meet Our Team</Title>
        <Fade>
          <Row style={{ marginBottom: "30px" }}>
            <Col>
              <TeamCard name="Andrew Doxey" role="Advisor" image={Doxey} />
            </Col>
            <Col>
              <TeamCard name="Jeremy Hirota" role="Advisor" image={Hirota} />
            </Col>
            <Col>
              <TeamCard name="Manjot Hunjan" role="Project Manager" image={Manjot} />
            </Col>
          </Row>
          <Row>
            <Col>
              <TeamCard name="Carson Zheng" role="Front-End Developer" image={Carson} />
            </Col>
            <Col>
              <TeamCard name="Linda Yang" role="Back-End Developer" image={Linda} />
            </Col>
            <Col>
              <TeamCard name="William Zhen" role="UI/UX Designer" image={William} />
            </Col>
          </Row>
        </Fade>
      </Container>
    </Section>
  );
}

export default Team;