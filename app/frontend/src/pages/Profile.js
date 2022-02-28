import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Section, Title } from '../components/Common/PageElement';
import ResultCardComponent from '../components/CardComponents/ResultCardComponent';
import { ResultHeader } from '../components/CardComponents/ResultCardComponent/StyledResultCard';
import { STANDARD_SUBMISSIONS_URL } from '../services/Config';
import { useGlobalContext } from "../context-provider";

import ResultsTable from '../components/TableComponents/ResultsTable'


const Profile = () => {
    const [data, setData] = useState([]);
    const context = useGlobalContext();

    useEffect(async () => {
        // useeffect runs on mount, so we need to simply re-run useeffect when context forces a re-render, and account for the scenario before that (useeffect runs twice)
        
        var token = localStorage.getItem('accessToken');

        if (!context.authenticated) return;

        else { 
            if (context.authenticated) {
                const res = await axios.get(STANDARD_SUBMISSIONS_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(res.data); 
            }
            else {
                alert("Please sign in to see this page")
            }
        }
    }, [context.authenticated])


    return (
        <Section id="profile">
            <Container>
                <Row>
                    <Col>
                        <Title>Saved Results</Title>
                    </Col>
                </Row>
                <Row>
                    <ResultsTable data={data}></ResultsTable> 
                </Row>
            </Container>
        </Section>
    )
}

export default Profile
