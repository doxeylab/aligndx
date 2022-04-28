import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Section} from '../components/Common/PageElement';

import { useAuthContext } from '../context/AuthProvider';
import { useQuery } from 'react-query'

import ResultsTable from '../containers/Results/ResultsTable';


const MyResults = () => {

    return (
        <Section id="profile">
            <ResultsTable />
        </Section>
    )
}

export default MyResults
