import React, {useState, useEffect} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Green_Check from '../assets/Green_Check.png'
import Red_X from '../assets/Red_X.png'
import axios from 'axios';
import Barchart from '../components/BarChart.js'
import { Link } from 'react-router-dom';

const Result = () => {
    try {
		var url_id = window.location.href.split('#/?')[1].split('&')[0].slice('id='.length)
	} catch(err) {
		var url_id = undefined
	}

    const [data, setData] = useState([{ "index": "TEST1", "column_category": 6 },
    { "index": "TEST2", "column_category": 12 },
    { "index": "TEST3", "column_category": 3 } ])

    const [result, setResult] = useState(null);
    const [sample, setSample] = useState(null);
    const [pathogen, setPathogen] = useState(null);
    // eslint-disable-next-line 
    const [columns, setColumns] = useState(null);
    // eslint-disable-next-line 
    const [indexes, setIndexes] = useState(null);

    useEffect(() => {
      axios.get('http://localhost:8080/results/' + url_id)
          .then(res => {
              console.log(res.data)
              setResult(res.data.detection_result)
              setSample(res.data.sample_name)
              setPathogen(res.data.detected_pathogen)
              setColumns(res.data.columns)
              setIndexes(res.data.index)
              setData(res.data.data)
          })
          .catch(() => {
              console.log('Error')
          })
    }, [])

    return (
        <div className="section">
            <div className="result-container">
                <Container>
                {result ?     
                    <Row className="resultNegative">
                        <h1 >
                            <img className="Red_X" src={Red_X} alt='Red_X' />{result} for ({pathogen})
                        </h1>
                    </Row>
                :
                    <Row className="resultPositive">
                        <h1 >
                            <img className="Green_Check" src={Green_Check} alt='Green_Check' />{result} for ({pathogen})
                        </h1>
                    </Row>
                }
                    <Row className="resultPageBody">
                        <Col className = 'barGraph'>
                            <Barchart data={data} />
                        </Col>

                        <Col className = 'sampleInfo'>
                            <h1>
                                Sample: {sample}
                            </h1>
                            <p>
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
                            </p>
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
    );
  }
   
export default Result;