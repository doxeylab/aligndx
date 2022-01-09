import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {WEBSOCKET_URL, RT_RES_STATUS} from '../services/Config';
import Barchart from '../components/BarChart';
import { Link } from 'react-router-dom';
import ResultCard from '../components/ResultCard.js';
import { Section } from '../components/PageElement'; 
import { TokenService } from '../services/Token';
import startFile from '../components/ChunkController/chunkController';
import Fade from 'react-reveal/Fade';
import UploadComponent from '../components/UploadComponent';
import SelectMenu from '../components/SelectMenu';
import Button from '../components/Button';
import { HeroImage } from '../components/HomeComponents/Hero/StyledHero';
import HomePageArt from '../assets/HomePageArt.svg';


const RealTime = () => {
    
    const token = TokenService(40);

    const [data, setData] = useState(null);
    const [sample, setSample] = useState("");
    const [pathogens, setPathogens] = useState(null); 
    const [getLoad, setGetLoad] = useState(true);  

    const [dataFiles, setDataFiles] = useState([]);
    const [email, setEmail] = useState('');
    const [option,setOption] = useState([]);

    const dataFileCallback = (file) => {
        setDataFiles(prevFiles => [...prevFiles, file])
    }

    const dataRemoveFileCallback = (fileName) => {
        const dataFileIndex = dataFiles.findIndex(e => e.name === fileName);
        dataFiles.splice(dataFileIndex, 1);
        setDataFiles([...dataFiles]);
    }

    const grabEmail = (emaildata) => { 
        console.log(emaildata);
        setEmail(emaildata);
    }

    const grabOption = (optiondata) => { 
        console.log(optiondata);
        setOption(optiondata);
    }

    // const connectWebsocket = async () => {
    //     try {
    //         const res = await axios.get(RT_RES_STATUS + '/' + token); 
    //         console.log(res.data)
    //         if (res.data.result === "pending"){ 
    //             console.log("pending")
    //             connectWebsocket();
    //         }
    //         else {
    //             const ws = new WebSocket(WEBSOCKET_URL + '/' + token)
    //             setGetLoad(false)
    //             ws.onmessage = function(event) {
    //                 console.log("connection established")
    //                 console.log(event.data)
    //                 setData(event.data)
    //                 setSample(event.data.sample)
    //                 setPathogens(event.data.pathogens)
    //         } 
    //     }} 
        
    //     catch (err) {
    //         // Handle Error Here
    //         console.log("error")
    //         console.error(err);  
    //     }
    // };

    const connectWebsocket = async () => {
        try {
            const ws = new WebSocket(WEBSOCKET_URL + '/' + token)
            console.log("connection established")
            setGetLoad(false)
            ws.onmessage = function (event) {
                if (event.data == "complete"){
                    ws.close();
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
        option.forEach(x => option_lst.push(x.title))
        console.log(option_lst)
        await startFile(dataFiles[0], token, option_lst, email); 
        await connectWebsocket()
    }
     
 
    return (
        <>
        {getLoad ?
            <Section id="hero" center>
            <Container>
                        <Fade left duration={1000} delay={600} distance="30px">
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
                                        <SelectMenu grabOption = {grabOption}/>
                                    </Col> 
                                    <Col>
                                        <Button fill disabled={dataFiles.length === 0 || option.length == 0 ? true : false} onClick={() => uploadChunked()}>Analyze</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Fade>
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