// React
import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// external libraries
import axios from 'axios';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Col, Container, Row } from 'react-bootstrap';

// Components
import Barchart from '../../components/BarChart';
import { Section, Title } from '../../components/Common/PageElement';
import LogInModal from '../../containers/Authentication';
import { Redirect } from 'react-router-dom';

// Styling
import { ResultAccordianTitle, ResultAccordionImg, ResultTitle } from './StyledResult';

// Assets
import Green_Check from '../../assets/Green_Check.png';
import Red_X from '../../assets/Red_X.png';

// Context
import { useGlobalContext } from "../../context-provider"
import { LoadContext } from '../../LoadContext';

// testing
import example_dataset from '../../assets/test_datasets/example_dataset.json';

// config
import { LINKED_RESULTS } from '../../services/Config';

const Result = () => {
    const context = useGlobalContext();
    const history = useHistory();
    const location = useLocation();

    const [link, setLink] = useState("/");
    const [showLogin, setShowLogin] = useState(false);
    const [error, setError] = useState(false)

    var dummyData = example_dataset

    const [data, setData] = useState(null);
    const [sample, setSample] = useState(null);
    const [pathogens, setPathogens] = useState(null);

    const { setLoad } = useContext(LoadContext);

    const resource = LINKED_RESULTS
    const token = localStorage.getItem("accessToken")

    const useQuery = () => {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const query = useQuery()
    const fileId = query.get("submission")

    useEffect(() => {
        if (!context.authenticated) {

            if (fileId) {
                setLink((location.pathname) + "?" + query.toString())
                setShowLogin(true)
            }
            else {
                history.push("/404")
            }
        }

        if (fileId && context.authenticated) {
            axios.get(resource + fileId, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    setData(res.data)
                    setPathogens(res.data.pathogens)
                    setSample(res.data.sample)
                })
                .catch(() => {
                    history.push("/404")
                })
        }
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <>
            {showLogin ? <Redirect to={{
                pathname: "/login",
                state: {
                    link: link
                }
            }} /> :
                data ?
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
                                            </Row>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Row>
                        </Container>
                    </Section>
                    :
                    <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading ...</h1>
            }
        </>
    )
}

export default Result