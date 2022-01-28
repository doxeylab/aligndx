// Styling Libraries
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Col, Container, Row } from 'react-bootstrap';

// React
import axios from 'axios';
import React, { useState, useContext } from 'react';

// Components
//// Core components
import startFile from '../../components/ChunkController/chunkController';
import UploadComponent from '../../components/UploadComponent';

//// Styling
import { Section, Title } from '../../components/Common/PageElement';
import { DropdownMenu, TextField } from '../../components/Form';
import RTBarchart from '../../components/RTBarChart';
import Button from '../../components/Button';
import { ResultAccordianTitle, ResultAccordionImg, ResultTitle } from './StyledResult'; 

// Assets
import Green_Check from '../../assets/Green_Check.png';
import Red_X from '../../assets/Red_X.png';

// Config
import { LoadContext } from '../../LoadContext';

// Testing
import example_dataset from '../../assets/example_dataset.json';

// Services
import { TokenService } from '../../services/Token';
import {WEBSOCKET_URL, RT_RES_STATUS} from '../../services/Config';
 


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

const RealTime = () => {
    
    const token = TokenService(40);

    const [show, setShow] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [dataFiles, setDataFiles] = useState([]);
    const { setLoad } = useContext(LoadContext);
    const [email, setEmail] = useState("");
    const [selectedDetections, setSelectedDetections] = useState([]);
     
    const [data, setData] = useState(null);
    const [sample, setSample] = useState("");
    const [pathogens, setPathogens] = useState(null); 
    const [getLoad, setGetLoad] = useState(true);  
 
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

    const connectWebsocket = async () => {
        try {
            console.log("trying websocket connection")
            const ws = new WebSocket(WEBSOCKET_URL + '/' + token) 
            ws.onerror = function (event) {
                console.log("didn't work")
                console.log(event)
            }
            ws.onopen = function (event) {
                console.log("opened")
                console.log(event)
            }
            ws.onclose = function (event) {
                console.log("socket closed")
                console.log(event)
            }
            ws.onmessage = function (event) {
                const obj = JSON.parse(event.data)
                if (obj.status == "complete"){
                    console.log(`Transaction status is ${obj.status}`)  
                    setData(event.data)
                    setSample(event.data.sample)
                    setPathogens(event.data.pathogens)
                    ws.close();
                }
                if (obj.status == "pending"){
                    console.log(`Transaction status is ${obj.status}`)  
                }

                if (obj.status == "ready"){
                    console.log(`Transaction status is ${obj.status}`)  
                    console.log(event.data)

                    setLoad(false)
                    setGetLoad(false)
                    setData(event.data)
                    setSample(event.data.sample)
                    setPathogens(event.data.pathogens)
                } 
                else { 
                    console.log(typeof obj)
                    console.log(Object.keys(obj))
                    console.log(`something went wrong. Check this data out: ${obj}`)
                }
            }
        }

        catch (err) {
            // Handle Error Here
            console.log("error")
            console.error(err);
        }
    };

    const uploadChunked = async () => {
        setLoad(true)
        const option_lst = []
        selectedDetections.forEach(x => option_lst.push(x))
        console.log(option_lst) 
        try {
            await startFile(dataFiles[0], token, option_lst, email, connectWebsocket); 
        }
        catch(e) {
            console.log(e)
        }
    }
     
 
    return (
        <>
        {getLoad ?
            <Section id="hero" center>
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
                                <Button fill disabled={dataFiles.length === 0 || selectedDetections.length === 0 ? true : false} onClick={() => uploadChunked()}>Analyze</Button>
                            </Col>
                        </Row>
                    </Container>
        </Section>
        :
        <Section id="result">
                    <Container>
                        <Row>
                            <Col>
                                <Title>Result</Title>
                            </Col>
                        </Row>
                        <Row>
                            <ResultTitle>Sample: {sample} for {pathogens}</ResultTitle>
                        </Row>
                        <Row>
                            {data.map((d) => (
                                <Accordion style={{ width: "100%" }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <ResultAccordionImg src={d.detected === "Negative" ? Red_X : Green_Check}></ResultAccordionImg>
                                        <ResultAccordianTitle detection={d.detected}>{d.detected}</ResultAccordianTitle>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            <Row style={{ padding: "25px" }}>
                                                <Col style={{ padding: "25px" }}>
                                                    <div className='barGraph'>
                                                        <RTBarchart data={d} yLabel={d.ylabel} xLabel={d.xlabel} col="coverage" />
                                                    </div>
                                                </Col>
                                                <Col style={{ padding: "25px" }}>
                                                    <div>
                                                        <h1>
                                                            {d.title}
                                                        </h1>
                                                        <p>
                                                            {d.text}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Row>
                    </Container>
                </Section>
        }
        </>
    );
  }
   
export default RealTime;