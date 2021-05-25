import React from 'react'
import HomePageArt from '../assets/HomePageArt.svg';
import { Container, Row, Col } from 'react-bootstrap';
import uploadImage from '../assets/uploadImage.svg';
import analyzeImage from '../assets/analyzeImage.svg';
import reportImage from '../assets/reportImage.svg';
import AnalyzeHomeBtn from '../components/AnalyzeHomeBtn/AnalyzeHomeBtn';

const Home = () => {

    return (
        <>
            <div className="section">
                <div className="home-container">
                    <Container>
                        {/* Genome Sequencing section */}
                        <Row className="home-wrapper">
                            <Col md={6} sm={12}>
                                <div className="home-wrapper__info">
                                    <h1 className="home-wrapper__info-title">GENOME<br/>SEQUENCING</h1>
                                    <p className="home-wrapper__info-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis elit eu nulla accumsan, ac rutrum mauris maximus. Sed lobortis, urna eget porttitor laoreet, sapien eros egestas mi, id iaculis arcu libero ut massa.</p>
                                    <AnalyzeHomeBtn />
                                </div>
                            </Col>
                            <Col md={6} sm={12}>
                                <div className="home-wrapper__image">
                                    <img className="Art" src={HomePageArt} alt="Art" />
                                </div>
                            </Col>
                        </Row>
                        {/* How it Works section */}
                        <div className="howItWorks">
                            <div className="howItWorksTitle">
                                <h1>How It Works</h1>
                            </div>
                            <div className="howItWorksBody">
                                <div className="process">
                                    <div className="processImageWrap">
                                        <img src={uploadImage} alt='uploadImage' />
                                    </div>
                                    <div className="processText">
                                        <h1>Upload Sequence</h1>
                                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam placeat!</p>
                                    </div>
                                </div>
                                <div className="process" >
                                    <div className="processImageWrap">
                                        <img src={analyzeImage} alt='analyzeImage' />
                                    </div>
                                    <div className="processText">
                                        <h1>Analysis</h1>
                                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam placeat!</p>
                                    </div>
                                </div>
                                <div className="process" >
                                    <div className="processImageWrap">
                                        <img src={reportImage} alt='reportImage' />
                                    </div>
                                    <div className="processText">
                                        <h1>Result</h1>
                                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam placeat!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        </>
    );
}

export default Home;