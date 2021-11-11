// React
import axios from 'axios';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Fade from 'react-reveal/Fade';
// Assets
import HomePageArt from '../../../assets/HomePageArt.svg';
import { UPLOAD_URL } from '../../../services/Config';
import { TokenService } from '../../../services/Token';
import Button from '../../Button';
// Components
import { Section } from '../../PageElement';
import UploadComponent from '../../UploadComponent';
// Styles
import './CustomModal.css';
import { HeroBody, HeroBtns, HeroImage, HeroText, HeroTitle } from './StyledHero';

const Hero = () => {
    const [show, setShow] = useState(false);
    const [dataFiles, setDataFiles] = useState([]);
    const [getLoad, setGetLoad] = useState(false);

    const dataFileCallback = (file) => {
        setDataFiles(prevFiles => [...prevFiles, file])
    }

    const dataRemoveFileCallback = (fileName) => {
        const dataFileIndex = dataFiles.findIndex(e => e.name === fileName);
        dataFiles.splice(dataFileIndex, 1);
        setDataFiles([...dataFiles]);
    }

    const upload = () => {
        setGetLoad(true)
        const token = TokenService(40);
        const formData = new FormData();

        formData.append("token", token)

        dataFiles.forEach(file => {
            formData.append('files', file)
        })

        axios.post(UPLOAD_URL, formData)
            .then(() => {
                window.location.href = "/results/#/?id=" + token
            })
            .catch(() => {
                console.log("ERROR")
            })
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {getLoad ?
                <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>LOADING...</h1>
                :
                <>
                    <Section id="hero" center>
                        <Container>
                            <Row>
                                <Col md={6} sm={12}>
                                    <Fade left duration={1000} delay={600} distance="30px">
                                        <HeroBody>
                                            <HeroTitle>PATHOGEN<br />DETECTION</HeroTitle>
                                            <HeroText>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                Mauris sagittis elit eu nulla accumsan, ac rutrum mauris maximus.
                                                Sed lobortis, urna eget porttitor laoreet, sapien eros egestas mi,
                                                id iaculis arcu libero ut massa.</HeroText>
                                            <HeroBtns>
                                                <Button onClick={handleShow}>Analyze</Button>
                                                <Button fill to="/result">Example</Button>
                                            </HeroBtns>
                                        </HeroBody>
                                    </Fade>
                                </Col>
                                <Col md={6} sm={12}>
                                    <Fade right duration={1000} delay={600} distance="30px">
                                        <HeroImage>
                                            <img className="Art" src={HomePageArt} alt="Art" />
                                        </HeroImage>
                                    </Fade>
                                </Col>
                            </Row>
                        </Container>
                    </Section>
                    <Modal size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={show}
                        onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Upload your Sequence
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="show-grid">
                            <Container>
                                <Row style={{ marginBottom: '1.5rem' }}>
                                    <Col>
                                        <UploadComponent
                                            fileCallback={dataFileCallback}
                                            selectedFiles={dataFiles}
                                            removeCallback={dataRemoveFileCallback}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button fill disabled={dataFiles.length === 0 ? true : false} onClick={() => upload()}>Analyze</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                    </Modal>
                </>
            }
        </>
    );
}

export default Hero;