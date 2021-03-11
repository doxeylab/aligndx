import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import demo_video from '../assets/demo_video.mp4';


const DownloadPage = () => {
  return (
    <div className="section">
        <Container className="download-page-container">
            <Row>
                <Col className="download-page-content">
                    <h1 >Take the Sequencing with you!</h1>
                    <p>
                        Fast and Accurate LFIA Image Analysis
                    </p>
                    <a href="https://play.google.com/store">
                        <button className='download-pg-btn' >Download App</button>
                    </a>
                </Col>
                <Col className="download-page-video">
                    <video width="360" height="auto" className="download-page-video"
                        autoPlay
                        loop
                        muted
                    >
                        <source src={demo_video} type="video/mp4"/>
                    </video>
                </Col>
            </Row>
        </Container>
    </div>
  );
}
 
export default DownloadPage;
