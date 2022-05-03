import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Section } from '../../components/Common/PageElement';

import { ResultCard } from '../../containers/Results/';
import example_dataset from '../../assets/test_datasets/example_dataset.json';
import { useUsers } from '../../api/Users'
import { Container } from '@mui/material';

const LinkedResults = () => {
    const navigate = useNavigate();
    const users = useUsers();

    var dummyData = example_dataset

    const [data, setData] = useState(null);

    const useParams = () => {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const params = useParams()
    const fileId = params.get("submission")

    useEffect(() => {

        if (fileId) {
            users.linked_results(fileId)
                .then(res => {
                    setData(res.data)
                })
                .catch(() => {
                    navigate("/404")
                })
        }
        else {
            navigate("/404")
        }
    }, [])

    return (
        <>
            <Section id='result'>
                <Container>
                    {
                        data ?
                            <ResultCard result={data} />
                            :
                            <div> There is no data</div>
                    }
                </Container>
            </Section>

        </>
    )
}

export default LinkedResults;