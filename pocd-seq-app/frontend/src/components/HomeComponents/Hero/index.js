// React
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
// Components
import { Section } from '../../PageElement'
import { Container, Row, Col } from 'react-bootstrap';
import {HeroImage, HeroBody, HeroTitle, HeroText, HeroBtns} from './StyledHero';
import Modal from 'react-bootstrap/Modal';
import UploadComponent from '../../UploadComponent';
import Button from '../../Button';
// Styles
import './CustomModal.css';
// Assets
import HomePageArt from '../../../assets/HomePageArt.svg';
import { UPLOAD_URL } from '../../../services/Config';
import { TokenService } from '../../../services/Token'
import axios from 'axios';

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
            .catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
              });
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
        {getLoad ?
            <h1 style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>LOADING...</h1>
        :
            <>
            <Section id="hero" center>
                <Container>
                    <Row>
                        <Col md={6} sm={12}>
                            <HeroBody>
                                <HeroTitle>PATHOGEN<br />DETECTION</HeroTitle>
                                <HeroText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Mauris sagittis elit eu nulla accumsan, ac rutrum mauris maximus. 
                                Sed lobortis, urna eget porttitor laoreet, sapien eros egestas mi, 
                                id iaculis arcu libero ut massa.</HeroText>
                                <HeroBtns>
                                    <Button onClick={handleShow}>Analyze</Button>
                                    <Button fill to="/result">Example</Button>
                                    {/* <Link to="/result">
                                        <Button>Demo File</Button>
                                    </Link> */}
                                </HeroBtns>
                            </HeroBody>
                        </Col>
                        <Col md={6} sm={12}>
                            <HeroImage>
                                <img className="Art" src={HomePageArt} alt="Art" />
                            </HeroImage>
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
                        <Row style={{marginBottom: '1.5rem'}}>
                            <Col>
                                <UploadComponent 
                                    fileCallback = {dataFileCallback} 
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