import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { RESULT_URL } from '../services/Config';
import Barchart from '../components/BarChart';
import { Link } from 'react-router-dom';
import ResultCard from '../components/ResultCard.js';

const Result = () => {
    try {
		var url_id = window.location.href.split('#/?')[1].split('&')[0].slice('id='.length)
	} catch(err) {
		var url_id = undefined
	}
    
    // const [data, setData] = useState([{ "index": "TEST1", "column_category": 6 },
    // { "index": "TEST2", "column_category": 12 },
    // { "index": "TEST3", "column_category": 3 } ])

    var dummyData = [{detection: "Positive", 
        pathogen_hits : 
            {data: [
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
        host_hits : 
            {data: [
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
        {detection: "Negative", 
        pathogen_hits : 
            {data: [
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
        host_hits : 
            {data: [
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

    const [sample, setSample] = useState(null);
    const [pathogen, setPathogen] = useState(null);
    const [data, setData] = useState(null);
    const [getLoad, setGetLoad] = useState(true);

    useEffect(() => {
      axios.get(RESULT_URL + '/' + url_id)
          .then(res => {
              var finalResponse = JSON.parse(res.data)
              console.log(finalResponse)
              var getLastValue = Math.max(...Object.keys(finalResponse))
              setData(finalResponse)
              setGetLoad(false)
              setPathogen(finalResponse.pathogen)
              setSample(finalResponse.sample)
          })
          .catch(() => {
            console.log('Error')
              setData(dummyData)
              setSample("SRR11365240")
              setPathogen("Sars CoV-2")
              setGetLoad(false)
          })
    }, [])

    return (
        <>
        {getLoad ?
            <h1 style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>LOADING...</h1>
        :
        <div className="section">
            <div className="result-container">
                <Container>
                    <Row>
                        <h1 className="result-container__title">Sample: {sample} for {pathogen}</h1>
                    </Row>
                    <Row>
                        {data.map(d => {
                            return (
                                <ResultCard detection={d.detection}>
                                    <Row style={{padding: "25px"}}>
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
                                        <Col md={6}>
                                            <div>
                                                <h1>
                                                    Host Marker Abundance
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
                                                <h1>Pathogen Hits</h1>
                                                <Barchart data={d.pathogen_hits.data} yLabel="Y-AXIS" xLabel="X-AXIS"/>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className = 'barGraph'>
                                                <h1>Host Hits</h1>
                                                <Barchart data={d.host_hits.data} yLabel="Y-AXIS2" xLabel="X-AXIS2"/>
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
            </div>
        </div>
        }
        </>
    );
  }
   
export default Result;