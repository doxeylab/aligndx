import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Section, Title } from '../components/Common/PageElement';
import { ResultHeader } from '../components/ProfileComponents/StyledProfile';
import ResultCardComponent from '../components/CardComponents/ResultCardComponent';
import { STANDARD_SUBMISSIONS_URL } from '../services/Config';
import { useGlobalContext } from "../context-provider";



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
                        <Title>Your Saved Results</Title>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ResultHeader>
                            <h1 style={{ margin: 0, fontSize: "1.2rem" }}>
                                File Name
                            </h1>
                            <h1 style={{ textAlign: "center", margin: 0, fontSize: "1.2rem" }}>
                                Upload Date
                            </h1>
                            <h1 style={{ textAlign: "center", margin: 0, fontSize: "1.2rem" }}>
                                Panel
                            </h1>
                            <span></span>
                        </ResultHeader>
                        {data.map((result) => <ResultCardComponent name={result.sample_name} uploadDate={result.created_date} pathogenType={result.panel}></ResultCardComponent>)} 
                    </Col>
                </Row>
            </Container>
        </Section>
    )
}

export default Profile
