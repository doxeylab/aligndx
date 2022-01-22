import React, {useState, useContext} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {WEBSOCKET_URL, RT_RES_STATUS} from '../services/Config';
import Barchart from '../components/BarChart';
import { Link } from 'react-router-dom';
import ResultCard from '../components/ResultCard.js';
import { Section } from '../components/Common/PageElement'; 
import { TokenService } from '../services/Token';
import startFile from '../components/ChunkController/chunkController';
import Fade from 'react-reveal/Fade';
import UploadComponent from '../components/UploadComponent'; 
import Button from '../components/Button';
import { HeroImage } from '../components/HomeComponents/Hero/StyledHero';
import HomePageArt from '../assets/HomePageArt.svg';
import { DropdownMenu, TextField } from '../components/Form';
import { LoadContext } from '../LoadContext';


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
            const ws = new WebSocket(WEBSOCKET_URL + '/' + token) 
            setGetLoad(false)
            ws.onmessage = function (event) {
                if (event.data == {"result":"complete"}){
                    ws.close();
                }
                if (event.data == {"result":"pending"}){
                    //pass
                }
                else {
                    console.log(event.data)
                    setData(event.data)
                    setSample(event.data.sample)
                    setPathogens(event.data.pathogens)
                }
            }
            window.addEventListener("unload", () => {
                if(ws.readyState == WebSocket.OPEN) {
                    ws.close();
                    console.log("disconnected")
                }
            }) 
        }

        catch (err) {
            // Handle Error Here
            console.log("error")
            console.error(err);
        }
    };

    const uploadChunked = async () => {
        setGetLoad(true)
        const option_lst = []
        selectedDetections.forEach(x => option_lst.push(x))
        console.log(option_lst)
        // await connectWebsocket() 
        try {
            await startFile(dataFiles[0], token, option_lst, email); 
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
        <Section full id="results">
            <Container className="result-container">
                <Row>
                    <h1 className="result-container__title">Sample: {sample} for {pathogens}</h1>
                </Row> 
                {/* <Row>
                    {data.map(d => {
                        return (
                            <ResultCard detection={d.detected}>
                                <Row style={{padding: "25px"}}>
                                <Col style={{padding: "25px"}}>
                                        <div className = 'barGraph'>
                                            <Barchart data={d} yLabel={d.ylabel} xLabel={d.xlabel} col="coverage"/>  
                                        </div>  
                                </Col> 
                                <Col style={{padding: "25px"}}> 
                                        <div>
                                            <h1>
                                                {d.title}
                                            </h1> 
                                            <p>
                                                {d.text }
                                            </p>
                                        </div> 
                                </Col>
                                </Row>
                            </ResultCard>
                        )
                    })}
                </Row> */}
                <Row>
                    <Col>
                        <button className="resultPageBtn saveResultBtn">Save Results</button>

                        <Link to="/home">
                            <button className="resultPageBtn upload-btn">Upload New</button>
                        </Link>
                    </Col>

                </Row>
            </Container>
        </Section>
        }
        </>
    );
  }
   
export default RealTime;