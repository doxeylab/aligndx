import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import {WEBSOCKET_URL, RT_RES_STATUS} from '../services/Config';
import Barchart from '../components/BarChart';
import { Link } from 'react-router-dom';
import ResultCard from '../components/ResultCard.js';
import { Section } from '../components/Common/PageElement'; 

const LiveResults = () => {
    try { 
		var url_id = window.location.href.split('#/?')[1].split('&')[0].slice('id='.length)
	} catch(err) {
		var url_id = undefined
	} 

    const [data, setData] = useState(null);
    const [sample, setSample] = useState("");
    const [pathogens, setPathogens] = useState(null); 
    const [getLoad, setGetLoad] = useState(true); 

    const connectWebsocket = async () => {
        try {
            const ws = new WebSocket(WEBSOCKET_URL + '/' + url_id)
            setGetLoad(false)
            ws.onmessage = function (event) {
                console.log("connection established")
                console.log(event.data)
                setData(event.data)
                setSample(event.data.sample)
                setPathogens(event.data.pathogens)
            }
        }

        catch (err) {
            // Handle Error Here
            console.log("error")
            console.error(err);
        }
    };

    useEffect(() => {  
       connectWebsocket();
        
    }, [])

    return (
        <>
        {getLoad ?
            <h1 style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>LOADING...</h1>
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
   
export default LiveResults;