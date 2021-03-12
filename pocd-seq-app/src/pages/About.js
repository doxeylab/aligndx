import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';


export default function About() {
  return (
    <div className="section">
          <>
          <Container>
              {/*About Us section*/}
              <div className="aboutUs">
                  <div className="aboutUsText">
                      <h1>About Us</h1>
                      <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, maiores sunt quas aut 
                      doloribus praesentium perspiciatis itaque. Blanditiis non minus ducimus autem hic recusandae 
                      repellendus amet, reprehenderit, rem debitis eos!
                      </p>
                  </div>
                  <img className="aboutUsImage" src={aboutUsImage} alt='aboutUsImage' />
              </div>

              {/*Meet the Professor section*/}
              <div className="meetTheProfessors">
                  <div className="meetTheProfessorsText">
                      <h1>Meet the Professors</h1>
                      <p>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad voluptatibus fugiat rem minus architecto praesentium facere non 
                      voluptas harum similique consequuntur dolores veniam ipsa autem tempora quam, ipsam nihil ullam!
                      </p>
                  </div>
                  <div className="ADoxeyCol">
                      <img className="ADoxeyImage" src={ADoxey} alt='ADoxeyImage' />
                      <h2>Andrew Doxey</h2>
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad voluptatibus fugiat rem minus architecto praesentium facere non 
                        voluptas harum similique consequuntur dolores veniam ipsa autem tempora quam, ipsam nihil ullam!
                      </p>
                  </div>
                  <div className="JHirotaCol">
                      <img className="JHirotaImage" src={JHirota} alt='JHirotaImage' />
                      <h2>Jeremy Hirota</h2>
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad voluptatibus fugiat rem minus architecto praesentium facere non 
                        voluptas harum similique consequuntur dolores veniam ipsa autem tempora quam, ipsam nihil ullam!
                      </p>
                  </div>
              </div>

              {/*Our Goals section*/}
              <div className="ourGoals" >
                  <div className="ourGoalsImageWrap">
                      <img src={OurGoals} alt='OurGoalsImage' />
                  </div>
  
                  <div className="ourGoalsText">
                      <h1>Our Goals</h1>
                      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam et voluptatibus corrupti illo illum doloribus sit placeat!</p>
                  </div>
              </div>

              {/*Company Updates section*/}
              <div className="companyUpdates">
                  <div className="companyUpdatesWrapper">
                      <div className="companyUpdatesTitle">
                          <h1>Company Updates!</h1>
                      </div>
                      <div className="companyUpdatesContent">
                          <div className="companyUpdatesAnnouncements">
                              <h2>Announcements</h2>
                              <p>Lorem ipsum dolor siolorem, odio animi cumque tempore blanditiis necessitatibus minus voluptatum at maxime</p>
                              {/*eslint-disable-next-line*/}
                              <a href="javascript:void(0);">Learn More</a>
                          </div>
                          <div className="companyUpdatesSocial">
                              <h2>Follow Us</h2>
                              <p>Lorem ipsum dolor, coillum iure aliquid? Sunt consequatur debitis ipsum tempore!</p>
                                <div className="companyUpdatesBox">
                                    <div className="companyUpdatesIcon"><i class="fab fa-facebook-f"></i></div>
                                    <div className="companyUpdatesIcon"><i class="fab fa-youtube"></i></div>
                                    <div className="companyUpdatesIcon"><i class="fab fa-github"></i></div>
                                </div>
                          </div>
                        </div>
                  </div>
              </div>
          </Container>
    </>
    </div>
  );
}