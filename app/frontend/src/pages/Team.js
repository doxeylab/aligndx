import React from 'react';
import { Section, Title } from '../components/PageElement';
import { Container, Row, Col } from 'react-bootstrap';
import TeamCard from '../components/TeamCard';
// Assets
import Doxey from '../assets/Team/ADoxey.png';
import Hirota from '../assets/Team/JHirota.png';
import Manjot from '../assets/Team/Manjot.png';
import Linda from '../assets/Team/Linda.jpeg';
import William from '../assets/Team/William.png';
import Carson from '../assets/Team/Carson.jpg';

const Team = () => {
  return (
    <Section>
      <Container>
        <Title>Meet Our Team</Title>
        <Row style={{marginBottom: "30px"}}>
          <Col>
            <TeamCard name="Andrew Doxey" role="Advisor" image={Doxey}/>
          </Col>
          <Col>
            <TeamCard name="Jermey Hirota" role="Advisor" image={Hirota}/>
          </Col>
          <Col>
            <TeamCard name="Manjot Hunjun" role="Project Manager" image={Manjot}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <TeamCard name="Carson Zheng" role="Front-End Developer" image={Carson}/>
          </Col>
          <Col>
            <TeamCard name="Linda Yang" role="Back-End Developer" image={Linda}/>
          </Col>
          <Col>
            <TeamCard name="William Zhen" role="UI/UX Designer" image={William}/>
          </Col>
        </Row>
      </Container>
      {/* <div className="team-container">
        <div className="teamWrap">
          <div className="teamWrapWidth">
            <div className="teamTitle">
              <h1>Meet Our Team</h1>
            </div>
            <div className="professorRow">
              <div className="professorTitle"><h2>Our Advisors</h2></div>
              <div className="professorWrap">
                <div className="teamProfileCol">
                  <div>
                    <a href="https://uwaterloo.ca/biology/people-profiles/andrew-c-doxey">
                      <div className="teamProfilePictures"><img src={ADoxey} alt='ADoxey' /></div>
                    </a>
                    <div className="teamProfileText">
                      <div>
                        <h2>Andrew Doxey</h2>
                        <h4>University of Waterloo</h4>
                        <p>
                          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="teamProfileCol">
                  <div>
                    <a href="https://healthsci.mcmaster.ca/firh/faculty-member-details/hirota-jeremy">
                      <div className="teamProfilePictures"><img src={JHirota} alt='JHirota' /></div>
                    </a>
                    <div className="teamProfileText">
                      <div>
                        <h2>Jeremy Hirota</h2>
                        <h4>McMaster University</h4>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="teamProfileCol"></div>
              </div>
            </div>
            <div className="developerRow">
              <div className="developerTitle"><h2>Our Developers</h2></div>
              <div className="developerWrap">
                <div className="teamProfileCol">
                  <div>
                    <a href="https://www.linkedin.com/in/manjotsinghhunjan/">
                      <div className="teamProfilePictures"><img src={Manjot} alt='Manjot' /></div>
                    </a>
                    <div className="teamProfileText">
                      <div>
                        <h2>Manjot Hunjun</h2>
                        <h4>Full Stack Developer</h4>
                        <p>
                          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="teamProfileCol">
                  <div>
                    <a href="https://www.linkedin.com/in/william-zhen/">
                      <div className="teamProfilePictures"><img src={William} alt='William' /></div>
                    </a>
                    <div className="teamProfileText">
                      <div>
                        <h2>William Zhen</h2>
                        <h4>UI/UX Developer</h4>
                        <p>
                          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="teamProfileCol">
                  <div>
                    <a href="https://www.linkedin.com/in/carson-zhang-71a59219b/">
                      <div className="teamProfilePictures"><img src={Carson} alt='Carson' /></div>
                    </a>
                    <div className="teamProfileText">
                      <div>
                        <h2>Carson Zhang</h2>
                        <h4>Frontend Developer</h4>
                        <p>
                          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </Section>
  );
}

export default Team;