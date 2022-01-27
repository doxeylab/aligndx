import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import example_dataset from '../../assets/example_dataset.json';
import Green_Check from '../../assets/Green_Check.png';
import Red_X from '../../assets/Red_X.png';
import Barchart from '../../components/BarChart';
import { Section, Title } from '../../components/Common/PageElement';
import { RESULT_URL } from '../../services/Config';
import { ResultAccordianTitle, ResultAccordionImg, ResultTitle } from './StyledResult';


const Result = () => {
    try {
        var url_id = window.location.href.split('#/?')[1].split('&')[0].slice('id='.length)
    } catch (err) {
        var url_id = undefined
    }

    // const [data, setData] = useState([{ "index": "TEST1", "column_category": 6 },
    // { "index": "TEST2", "column_category": 12 },
    // { "index": "TEST3", "column_category": 3 } ])

    var dummyData = example_dataset

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
            {data ?
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
                                                        <Barchart data={d} yLabel={d.ylabel} xLabel={d.xlabel} col="coverage" />
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
                :
                <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>LOADING...</h1>
            }
        </>
    )
}

export default Result