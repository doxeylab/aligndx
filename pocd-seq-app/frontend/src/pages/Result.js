import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Green_Check from '../assets/Green_Check.png'
import Red_X from '../assets/Red_X.png'
import axios from 'axios';
import { RESULT_URL } from '../services/Config';
import Barchart from '../components/BarChart.js'
import { Link } from 'react-router-dom';

const Result = () => {
    try {
		var url_id = window.location.href.split('#/?')[1].split('&')[0].slice('id='.length)
	} catch(err) {
		var url_id = undefined
	}

    // const [data, setData] = useState([{ "index": "TEST1", "column_category": 6 },
    // { "index": "TEST2", "column_category": 12 },
    // { "index": "TEST3", "column_category": 3 } ])

    var dummyData = [{ "index": "TEST1", "NumReads": 6 },
    { "index": "TEST2", "NumReads": 12 },
    { "index": "TEST3", "NumReads": 3 },
    { "index": "TEST4", "NumReads": 1 },
    { "index": "TEST5", "NumReads": 0 },
    { "index": "TEST6", "NumReads": 15 },
    { "index": "TEST7", "NumReads": 8 },
    { "index": "TEST8", "NumReads": 4 }
 ]

    const [result, setResult] = useState(null);
    const [sample, setSample] = useState(null);
    const [pathogen, setPathogen] = useState(null);
    // eslint-disable-next-line 
    const [columns, setColumns] = useState(null);
    // eslint-disable-next-line 
    const [indexes, setIndexes] = useState(null);
    const [data, setData] = useState(null)
    const [getLoad, setGetLoad] = useState(true)

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
                {data.detection === "Negative" ?     
                    <Row>
                        <Col>
                            <div className="resultNegative">
                                <h1 >
                                    <img className="Red_X" src={Red_X} alt='Red_X' />{data.detection} for ({pathogen})
                                </h1>
                            </div>
                        </Col>
                    </Row>
                :
                    <Row>
                        <Col>
                            <div className="resultPositive">
                                <h1 >
                                    <img className="Green_Check" src={Green_Check} alt='Green_Check' /> Sample {sample} {data.detected} for ({pathogen})
                                </h1>
                            </div>
                        </Col>
                    </Row>
                }
                    <Row className="resultPageBody">
                        <Col md={8}>
                            <div className = 'barGraph'>
                                <Barchart data={data.pathogen_hits.data} />
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className = 'sampleInfo'>
                                <h1>
                                    Pathogen Marker Abundance
                                </h1>
                                <p>
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="resultPageBody">
                        <Col md={8}>
                            <div className = 'barGraph'> 
                                <Barchart data={data.host_hits.data} />
                            </div>
                        </Col>

                        <Col md={4}>
                            <div className = 'sampleInfo'>
                                <h1>
                                    Host Biomarker Abundance
                                </h1>
                                <p>
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
                                </p>
                            </div>
                        </Col>
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