// React
import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation} from 'react-router-dom';

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
import LogInModal from '../../components/Modals/LoginModal/LoginModal';
import { Redirect } from 'react-router-dom';

// Styling
import { ResultAccordianTitle, ResultAccordionImg, ResultTitle } from './StyledResult';

// Assets
import Green_Check from '../../assets/Green_Check.png';
import Red_X from '../../assets/Red_X.png';

// Context
import {useGlobalContext} from "../../context-provider"
import { LoadContext } from '../../LoadContext';

// testing
import example_dataset from '../../assets/test_datasets/example_dataset.json';

// config
import { STANDARD_RESULTS } from '../../services/Config';

const Result = () => {   
    const context = useGlobalContext(); 
    const history = useHistory();
    const location = useLocation();

    const [link,setLink] = useState("/");
    const [showLogin,setShowLogin] = useState(false);
    const [error,setError] = useState(false)

    var dummyData = example_dataset

    const [data, setData] = useState(null);
    const [sample, setSample] = useState(null);
    const [pathogens, setPathogens] = useState(null);
    
    const { setLoad } = useContext(LoadContext);
    
    const resource = STANDARD_RESULTS
    const token = localStorage.getItem("accessToken") 

    const useQuery = () => {
        const {search} = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }
    
    const query = useQuery()
    const fileId = query.get("submission")

    useEffect( () => {
        if (!context.authenticated) {
            
            if (fileId){
                setLink((location.pathname) +"?"+ query.toString())
                setShowLogin(true)
            }
            else {
            }
        }

        if (query.get("submission") && context.authenticated) {
            console.log(fileId)
            axios.get(resource + fileId, {headers: {'Authorization': `Bearer ${token}`}})
            .then(res => {
                setData([res.data])
                setPathogens(res.data.pathogens)
                setSample(res.data.sample)
            })
            .catch(() => {
                setError(true)
            }) 
        }
        else {
            // history.push("/")
        }
    }, [])
  

    return (
        <>
            {showLogin ? <Redirect to={{
                pathname:"/login",
                state:{
                    link:link
                }
            }}/> :
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
                                                        <Barchart data={d} yLabel={d.ylabel} xLabel={d.xlabel} col="coverage" xkey="pathogen" ykey="coverage" />
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
                <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Does Not Exist</h1> 
            }
        </>
    )
}

export default Result