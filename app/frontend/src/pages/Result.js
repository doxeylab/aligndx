import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Barchart from '../components/BarChart';
import { Section } from '../components/Common/PageElement';
import ResultCard from '../components/ResultCard.js';
import { RESULT_URL } from '../services/Config';

const Result = () => {
    try {
        var url_id = window.location.href.split('#/?')[1].split('&')[0].slice('id='.length)
    } catch (err) {
        var url_id = undefined
    }

    // const [data, setData] = useState([{ "index": "TEST1", "column_category": 6 },
    // { "index": "TEST2", "column_category": 12 },
    // { "index": "TEST3", "column_category": 3 } ])

    var dummyData = [{
        detection: "Positive",
        pathogen_hits:
        {
            data: [
                { "index": "TEST1", "NumReads": 6 },
                { "index": "TEST2", "NumReads": 12 },
                { "index": "TEST3", "NumReads": 3 },
                { "index": "TEST4", "NumReads": 1 },
                { "index": "TEST5", "NumReads": 0 },
                { "index": "TEST6", "NumReads": 15 },
                { "index": "TEST7", "NumReads": 8 },
                { "index": "TEST8", "NumReads": 4 }
            ]
        },
        host_hits:
        {
            data: [
                { "index": "TEST1", "NumReads": 6 },
                { "index": "TEST2", "NumReads": 12 },
                { "index": "TEST3", "NumReads": 3 },
                { "index": "TEST4", "NumReads": 1 },
                { "index": "TEST5", "NumReads": 0 },
                { "index": "TEST6", "NumReads": 15 },
                { "index": "TEST7", "NumReads": 8 },
                { "index": "TEST8", "NumReads": 4 }
            ]
        }
    },
    {
        detection: "Negative",
        pathogen_hits:
        {
            data: [
                { "index": "TEST1", "NumReads": 6 },
                { "index": "TEST2", "NumReads": 12 },
                { "index": "TEST3", "NumReads": 3 },
                { "index": "TEST4", "NumReads": 1 },
                { "index": "TEST5", "NumReads": 0 },
                { "index": "TEST6", "NumReads": 15 },
                { "index": "TEST7", "NumReads": 8 },
                { "index": "TEST8", "NumReads": 4 }
            ]
        },
        host_hits:
        {
            data: [
                { "index": "TEST1", "NumReads": 6 },
                { "index": "TEST2", "NumReads": 12 },
                { "index": "TEST3", "NumReads": 3 },
                { "index": "TEST4", "NumReads": 1 },
                { "index": "TEST5", "NumReads": 0 },
                { "index": "TEST6", "NumReads": 15 },
                { "index": "TEST7", "NumReads": 8 },
                { "index": "TEST8", "NumReads": 4 }
            ]
        }
    }
    ]

    const [data, setData] = useState(null);
    const [sample, setSample] = useState(null);
    const [pathogens, setPathogens] = useState(null); 
    const [getLoad, setGetLoad] = useState(true);
    const sendGetRequest = async () => {
        try {
            const res = await axios.get(RESULT_URL + '/' + url_id);   
            console.log(res.data)
            setData([res.data])
            setGetLoad(false)
            setPathogens(res.data.pathogens)
            setSample(res.data.sample) 
        } 
        
        catch (err) {
            // Handle Error Here
            console.error(err); 
            console.log('Error')
            setData(dummyData)
            setSample("SRR11365240")
            setPathogens("Sars CoV-2")
            setGetLoad(false) 
        }
    };

    useEffect(() => {
        // sendGetRequest();
      axios.get(RESULT_URL + '/' + url_id)
          .then(res => {
              console.log(res.data)
              setData([res.data])
              setGetLoad(false)
              setPathogens(res.data.pathogens)
              setSample(res.data.sample)
          })
          .catch(() => {
            console.log('Error')
              setData(dummyData)
              setSample("SRR11365240")
              setPathogens("Sars CoV-2")
              setGetLoad(false)
          })
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
                <Row>
                    {data.map(d => {
                        return (
                            <ResultCard detection={d.detected}>
                                {/* <Row style={{padding: "25px"}}>
                                    <Col md={6}>
                                        <div>
                                            <h1>
                                                Pathogen Marker Abundance
                                            </h1>
                                            <p>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{padding: "25px"}}>
                                    <Col md={6}>
                                        <div className = 'barGraph'>
                                            <h1>{d.title}</h1>
                                            <Barchart data={d} yLabel={d.ylabel} xLabel={d.xlabel} col="coverage"/>
                                        </div>
                                    </Col>
                                </Row> */}
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
                </Row>
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

export default Result;