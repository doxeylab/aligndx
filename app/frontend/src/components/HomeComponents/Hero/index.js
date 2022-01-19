import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Fade from 'react-reveal/Fade';
import HomePageArt from '../../../assets/HomePageArt.svg';
import { LoadContext } from '../../../LoadContext';
import { UPLOAD_URL } from '../../../services/Config';
import { TokenService } from '../../../services/Token';
import Button from '../../Button';
import { Section } from '../../Common/PageElement';
import { DropdownMenu, TextField } from '../../Form';
import UploadComponent from '../../UploadComponent';
import startFile from './ChunkController/chunkController';
import './CustomModal.css';
import { HeroBody, HeroBtns, HeroBtns2, HeroCol, HeroImage, HeroText, HeroTitle } from './StyledHero';

const selectmenuoptions = [
    {
        id: "panel",
        category: "Panel",
        opts: [
            { value: "bacterial", label: "Bacterial" },
            { value: "viral", label: "Viral" }
        ]
    },
    {
        id: "bacteria",
        category: "Bacteria",
        opts: [
            { value: "streptococcus_pneumoniae", label: "Streptococcus pneumoniae" },
            { value: "moraxella_catarrhalis", label: "Moraxella Catarrhalis" },
            { value: "haemophilus_influenzae", label: "Haemophilus Influenzae" },
        ]
    },
    {
        id: "virus",
        category: "Virus",
        opts: [
            { value: "influenza", label: "Influenza" },
            { value: "sars_cov_2", label: "Sars-Cov-2" }
        ]
    }
];

const Hero = () => {
    const [show, setShow] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [dataFiles, setDataFiles] = useState([]);
    const { setLoad } = useContext(LoadContext);
    const [email, setEmail] = useState("");
    const [selectedDetections, setSelectedDetections] = useState([]);

    const handleEmailError = (err) => {
        setEmailError(err)
    }

    const dataFileCallback = (file) => {
        setDataFiles(prevFiles => [...prevFiles, file])
    }

    const dataRemoveFileCallback = (fileName) => {
        const dataFileIndex = dataFiles.findIndex(e => e.name === fileName);
        dataFiles.splice(dataFileIndex, 1);
        setDataFiles([...dataFiles]);
    }

    const detectionCallback = (detections) => {
        setSelectedDetections(detections)
    }

    const emailCallback = (mail) => {
        setEmail(mail)
    }

    const uploadChunked = () => {
        if (emailError) {
            setErrorMsg(true)
            return
        }
        setLoad(true)
        const token = TokenService(40);
        const option_lst = []
        selectedDetections.forEach(x => option_lst.push(x.title))
        console.log(option_lst)
        startFile(dataFiles[0], token, option_lst, email);
    }

    const routeToRealTime = () => {
        window.location.href = "/realtime"
    }

    const upload = () => {
        setLoad(true)
        const token = TokenService(40);
        const formData = new FormData();

        formData.append("token", token)

        formData.append("email", email)

        dataFiles.forEach(file => {
            formData.append('files', file)
        })

        selectedDetections.forEach(x => {
            formData.append("panel", x.title)
        })

        axios.post(UPLOAD_URL, formData)
            .then(() => {
                setLoad(false)
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

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
 

    return (
        <>
            <Section id="hero" center>
                <Container>
                    <Row>
                        <HeroCol sm={6}>
                            <Fade left duration={1000} delay={600} distance="30px">
                                <HeroBody>
                                    <HeroTitle>PATHOGEN<br />DETECTION</HeroTitle>
                                    <HeroText>Analyze your .fastq or .fastq.gz files with out streamlined RNA-seq pipeline. Alternatively, go through our examples for sample results.</HeroText>
                                    <HeroBtns>
                                        <Button onClick={handleShow}>Standard</Button>
                                        <Button onClick={routeToRealTime}>Real Time</Button>
                                        <Button fill to="/result">Example</Button>
                                    </HeroBtns>
                                </HeroBody>
                            </Fade>
                        </HeroCol>
                        <HeroCol sm={6}>
                            <Fade right duration={1000} delay={600} distance="30px">
                                <HeroImage className="Art" src={HomePageArt} alt="Art" />
                            </Fade>
                        </HeroCol>
                    </Row>
                    <Row>
                        <HeroCol>
                            <Fade left duration={1000} delay={600} distance="30px">
                                <HeroBtns2>
                                    <Button onClick={handleShow}>Standard</Button>
                                    <Button onClick={routeToRealTime}>Real Time</Button>
                                    <Button fill to="/result">Example</Button>
                                </HeroBtns2>
                            </Fade>
                        </HeroCol>
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
                        {errorMsg ?
                            <Row>
                                <Col sm={{ span: 6, offset: 6 }}>
                                    <p style={{ color: "#FF0000" }}>Invalid Email!</p>
                                </Col>
                            </Row>
                            :
                            ``
                        }
                        <Row style={{ marginBottom: '1.5rem' }}>
                            <Col sm={6}>
                                <DropdownMenu
                                    options={selectmenuoptions}
                                    val="value"
                                    label="label"
                                    category="category"
                                    valueCallback={detectionCallback}
                                    placeholder="Select your pathogen(s)"
                                />
                            </Col>
                            <Col sm={6}>
                                <TextField
                                    placeholder="Enter your email"
                                    valueCallback={emailCallback}
                                    type="email"
                                    errorCallback={handleEmailError}
                                    errorMsg={errorMsg}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button fill disabled={dataFiles.length === 0 || selectedDetections.length === 0 ? true : false} onClick={() => upload()}>Analyze</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Hero;