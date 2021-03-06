import React from 'react'
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg';
import { Container, Row, Col } from 'react-bootstrap';


const result_test = () => {

    return (
        <>
            <div className="home">
                <Container>
                    <Row className="home-wrapper">
                        <Col >
                           
                        </Col>
                        <Col >
                          
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

