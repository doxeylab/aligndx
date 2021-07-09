// React
import React, { useEffect } from 'react'
import Aos from "aos";
import { motion } from 'framer-motion';
// Components
import { Title, Section } from '../components/PageElement'
import HomePageArt from '../assets/HomePageArt.svg';
import { Container, Row, Col } from 'react-bootstrap';
import uploadImage from '../assets/uploadImage.svg';
import analyzeImage from '../assets/analyzeImage.svg';
import reportImage from '../assets/reportImage.svg';
import AnalyzeHomeBtn from '../components/AnalyzeHomeBtn/AnalyzeHomeBtn';

const Home = () => {
    //Animations for Title block//
    //Uses the Aos library//
    useEffect(() => {
        Aos.init({ duration: 2000, 
        once:true  
        });
    }, []);

    //Animations for scroll down fade out//
    //Detects scrolling//
    const [lastYPos, setLastYPos] = React.useState(0);
    const [shouldShowActions, setShouldShowActions] = React.useState(true);

    React.useEffect(() => {
        function handleScroll() {
            const yPos = window.scrollY;
            const isScrollingUp = yPos < lastYPos;

            setShouldShowActions(isScrollingUp);
            setLastYPos(yPos);
        }

        window.addEventListener("scroll", handleScroll, false);

        return () => {
            window.removeEventListener("scroll", handleScroll, false);
        };
    }, [lastYPos]);

    return (
        <>
            <Section id="hero" center>
                <Container>
                    {/* Genome Sequencing section */}
                    <Row className="home-wrapper">
                        <Col md={6} sm={12}>
                            <div data-aos="fade-right" className="home-wrapper__info">
                                <h1 className="home-wrapper__info-title">GENOME<br />SEQUENCING</h1>
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
                    <Row>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: shouldShowActions ? 1 : 0 }}
                            transition={{ opacity: { duration: 0.6 } }}
                        >
                            <div className="scrollDown">
                                <p>Scroll Down</p>
                                <div className="scrollIcon">
                                <i class="fas fa-angle-double-down"></i>
                                </div>
                            </div>
                        </motion.div>
                    </Row>
                </Container>
            </Section>
            <Section id="info">
                <Container>
                    <Row>
                        <Col>
                            <Title>How it works</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={12}>
                            <div className="processImageWrap">
                                <img src={uploadImage} alt='uploadImage' />
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
                            <div className="processText">
                                <h1>Upload Sequence</h1>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam placeat!</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={12}>
                            <div className="processImageWrap">
                                <img src={analyzeImage} alt='uploadImage' />
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
                            <div className="processText">
                                <h1>Upload Sequence</h1>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam placeat!</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={12}>
                            <div className="processImageWrap">
                                <img src={reportImage} alt='uploadImage' />
                            </div>
                        </Col>
                        <Col md={6} sm={12}>
                            <div className="processText">
                                <h1>Upload Sequence</h1>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere nisi magnam sed quaerat, sint explicabo quis possimus nesciunt nostrum, sapiente enim nam placeat!</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Section>
        </>
    );
}

export default Home;