import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg';

const Result = () => {
  return (
      <>
         <div className="result">
                <Container className="result-container">
                <h1 className="result-page-title">Your Results</h1>
                    <Row className="result-wrapper">
                        <Col >
                            <div className="result-wrapper-box">
                                <h1 className="result-wrapper-title">Test Name #1</h1>
                                <p className="result-wrapper-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis elit eu nulla accumsan, ac rutrum mauris maximus. Sed lobortis, urna eget porttitor laoreet, sapien eros egestas mi, id iaculis arcu libero ut massa.</p>

                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={6}>
                            <div className="result-wrapper-box">
                                <h2 className="result-pos-neg">Tested: Positive</h2>
                            </div>
                        </Col>
                        <Col md={3} sm={3}>
                            <div className="result-wrapper-box">
                                <h2 className="btn-test">Button</h2>
                            </div>
                        </Col>
                        <Col md={3} sm={3}>
                            <div className="result-wrapper-box">
                                <h2 className="btn-test">Button</h2>
                            </div>
                        </Col>
                    </Row>


                    
                </Container>
                <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
                <img className="rightBackground" src={rightBackground} alt='rightBackground' />
            </div>
      </>
  );
}
 
export default Result;
