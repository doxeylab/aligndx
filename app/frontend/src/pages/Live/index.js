// Styling Libraries
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Col, Container, Row } from 'react-bootstrap';

// React
import React, { useState, useEffect } from 'react';
import { useLocation, useHistory} from 'react-router-dom';

// Components
//// Core components
import ChunkProcessor from '../../components/ChunkController/chunkProcessor'

//// Styling
import { Section, Title } from '../../components/Common/PageElement';
import Barchart from '../../components/BarChart';
import { ResultAccordianTitle, ResultAccordionImg, ResultTitle } from './StyledResult'; 

// Assets
import Green_Check from '../../assets/Green_Check.png';
import Red_X from '../../assets/Red_X.png';

// Config
import {useGlobalContext} from "../../context-provider"

// Testing

// Services
import {WEBSOCKET_URL} from '../../services/Config';
 

const Live = () => {

    const history = useHistory();
    const location = useLocation();

    // declare auth dependencies
    const context = useGlobalContext();

    // results state
    const [data, setData] = useState(null);
    const [sample, setSample] = useState("");
    const [pathogens, setPathogens] = useState(null); 

    // config state

    // state handlers

    const datahandler = (data, sample, pathogens) => {
        try {
            setData(JSON.parse(data))
            setSample(JSON.parse(sample))
            setPathogens(JSON.parse(pathogens))
        }
        
        catch (err) {
            console.log(err)
        }
            
    }
    // websocket handler

    const connectWebsocket = async (file_id, token, callback) => {
        try {
            if (history.listen(
                (location) => {
                    ws.close()
                    console.log(`You changed the page to: ${location.pathname}`)
                }
            ))
            console.log("trying websocket connection")
            const ws = new WebSocket(WEBSOCKET_URL + '/' + file_id) 
            
            // ws.onerror = function (event) {
            //     console.log("didn't work")
            //     console.log(event)
            // }
            ws.onopen = function (event) {
                ws.send(token) 
            }
            
            // ws.onclose = function (event) {
            //     console.log("socket closed")
            //     console.log(event)
            // }

            ws.onmessage = function (event) {
                const obj = JSON.parse(event.data)
                if (obj.status == "complete"){
                    console.log(`Transaction status is ${obj.status}`)
                    callback(event.data, event.data.sample, event.data.pathogens)
                    ws.close();
                }
                if (obj.status == "pending"){
                    console.log(`Transaction status is ${obj.status}`)  
                }

                if (obj.status == "ready"){
                    console.log(`Transaction status is ${obj.status}`)  
                    // console.log(event.data)
                    callback(event.data, event.data.sample, event.data.pathogens)
                } 
            }
        }

        catch (err) {
            // Handle Error Here
            console.log("error")
            console.error(err);
        }
    };

    let lstate = location.state
    let fileId = null
    let restartflag = null
    let file = null
    let panels = null
    
    useEffect(() => {
        if (!lstate){
            history.push('/')
        }

        else {
            fileId = lstate.fileId
            restartflag = lstate.restartflag
            file = lstate.file
            panels = lstate.panels
            ChunkProcessor(token, file, panels, fileId, restartflag) 
        }
    }, [])


    const token = localStorage.getItem("accessToken") 
    
    useEffect(() => {
        window.onbeforeunload = function() {
            restartflag = true 
            return true;
        };
    
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        connectWebsocket(fileId, token, datahandler)
        console.log(data, sample, pathogens)
    }, [])
 
    return (
        <>
            {data ?
                <Section id="result">
                    <Container>
                        <Row>
                            <Col>
                                <Title>Result</Title>
                            </Col>
                        </Row>
                        <Row>
                            <ResultTitle>{sample}</ResultTitle>
                        </Row>
                        <Row>
                            <Accordion style={{ width: "100%" }} defaultExpanded={true} >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <ResultAccordionImg src={data.detected === "Negative" ? Red_X : Green_Check}></ResultAccordionImg>
                                    <ResultAccordianTitle detection={data.detected}>{data.detected}</ResultAccordianTitle>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <Row style={{ padding: "25px" }}>
                                            <Col style={{ padding: "25px" }}>
                                                <div className='barGraph'>
                                                    <Barchart data={data} yLabel={data.ylabel} xLabel={data.xlabel} col="coverage" xkey="Pathogen" ykey="Coverage" />
                                                </div>
                                            </Col>
                                            <Col style={{ padding: "25px" }}>
                                                <div>
                                                    <h1>
                                                        {data.title}
                                                    </h1>
                                                    <p>
                                                        {data.text}
                                                    </p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Row>
                    </Container>
                </Section>
                :
                <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>LOADING...</h1>
            }
        </>
    )
}
   
export default Live;