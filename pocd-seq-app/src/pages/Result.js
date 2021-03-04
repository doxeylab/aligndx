import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import topLeftBackground from '../assets/topLeftBackground.svg';
import rightBackground from '../assets/rightBackground.svg'; 
// import ResultAnalysis from "../components/ResultAxios";
 
const Result = () => {
    const [result, setResult] = useState(null);
    const [sample, setSample] = useState(null);
    const [pathogen, setPathogen] = useState(null);
    const [columns, setColumns] = useState(null);
    const [indexes, setIndexes] = useState(null);
    const [data, setData] = useState(null);
    useEffect(() => {
      axios.get('http://localhost:8080/results')
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
      <>
         <div className="result">
                <Container className="result-container">
                <h1 className="result-page-title">Your Results</h1>
                    <Row className="result-wrapper">
                        <Col >
                            <div className="result-wrapper-box"> 
                                <h1 className="result-wrapper-title">Test for sample {sample}</h1>
                                <p className="result-wrapper-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis elit eu nulla accumsan, ac rutrum mauris maximus. Sed lobortis, urna eget porttitor laoreet, sapien eros egestas mi, id iaculis arcu libero ut massa.</p>

                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} sm={6}>
                            <div className="result-wrapper-box"> 
                                <h2 className="result-pos-neg">Tested: {result}</h2>
                            </div>
                        </Col> 
                    </Row>


                    
                </Container>
                <img className="topLeftBackground" src={topLeftBackground} alt='topLeftBackground' />
                <img className="rightBackground" src={rightBackground} alt='rightBackground' />
            </div>
      </>
  );
}
 
export default Result;
