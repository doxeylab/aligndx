// React
import React, { useContext, useState } from 'react';

// external libraries
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Fade from 'react-reveal/Fade';

// Components
import { Section } from '../../Common/PageElement';
import { DropdownMenu, TextField } from '../../Form';
import UploadComponent from '../../UploadComponent';
import Button from '../../Button';

// Styling
import { Col, Container, Row } from 'react-bootstrap';
import HomePageArt from '../../../assets/HomePageArt.svg';
import './CustomModal.css';
import { HeroBody, HeroBtns, HeroBtns2, HeroCol, HeroImage, HeroText, HeroTitle } from './StyledHero';

// Context
import { LoadContext } from '../../../LoadContext';
import {useGlobalContext} from "../../../context-provider";

// Config
import { UPLOAD_URL} from '../../../services/Config';


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
    const context = useGlobalContext();

    const [show, setShow] = useState(false);
    const [dataFiles, setDataFiles] = useState([]);
    const { setLoad } = useContext(LoadContext);
    const [selectedDetections, setSelectedDetections] = useState([]);

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
 
    const routeToRealTime = () => {
        if (context.authenticated == true) {
            window.location.href = "/realtime"
        }
        else {
            alert("Please sign in to use this service")
        }
    }

    const upload = () => {
        setLoad(true) 

        if (context.authenticated == true) {
            const formData = new FormData();
  
            dataFiles.forEach(file => {
                formData.append('files', file)
            })
            selectedDetections.forEach(x => {
                formData.append("panel", x)
            })

            var resource = UPLOAD_URL
            const token = localStorage.getItem("accessToken")

            axios.post(resource, formData, {headers: {
                'Authorization': `Bearer ${token}`
            }})
                .then((res) => {
                    setLoad(false)
                    const fileId = res.data.File_ID;  
                    window.location.href = "/results/#/?id=" + fileId 
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
        else {  
            alert("Please sign in to use this service")
            setLoad(false) 
        }  
         
    }

    const handleShow = () => {
        if (context.authenticated == true){
            setShow(true);
        }
        else {
            alert("Please sign in to use this service")
        }
    }
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
                        <Row style={{ marginBottom: '1.5rem' }}>
                                <DropdownMenu
                                    options={selectmenuoptions}
                                    val="value"
                                    label="label"
                                    category="category"
                                    valueCallback={detectionCallback}
                                    placeholder="Select your pathogen(s)"
                                />
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