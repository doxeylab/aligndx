import React from 'react'
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg';
import { Container, Row, Col } from 'react-bootstrap';


const result_test = () => {

    return (
        <>
            <div className="result_test">
                <Container>
                    <Row className="result_page_pos_neg">
                        <h1 >
                            Negative (Sars-coV-2)
                        </h1>
                    </Row>

                    <Row>
                        <Col className = 'graph'>
                            <h1>
                                Bar Graph
                            </h1>
                        </Col>

                        <Col className = 'sample_info'>
                            <h1>
                                Sample: SRR
                            </h1>
                            <p>
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className = 'button_col'>
                            <button className="result_pg_button">Save Results</button>
                            <button className="result_pg_button">Upload New</button>
                        </Col>
                        <Col>
                            
                        </Col>


                    </Row>

                </Container>
                <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
                <img className="rightBackground" src={rightBackground} alt='rightBackground' />
            </div>

        </>
    );
  }
   
export default result_test;

