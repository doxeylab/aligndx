import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Section, Title } from '../components/Common/PageElement'; 
import { STANDARD_SUBMISSIONS_URL } from '../services/Config';

import {useAuthContext} from '../context/AuthProvider';

import ResultsTable from '../containers/Results/ResultsTable';


const MyResults = () => {
    const [data, setData] = useState(null);
    const context = useAuthContext();

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
            <ResultsTable />
        </Section>
    )
}

export default MyResults
