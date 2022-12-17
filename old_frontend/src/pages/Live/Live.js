import React, { useEffect, useState } from 'react';
import { useLocation} from 'react-router-dom';

import {ResultCard} from '../../containers/Results';

import { Container } from '@mui/material';
import { Section } from '../../components/Common/PageElement';

import exampledataset from './../../assets/test_datasets/example_dataset.json'
import useWebSocket from '../../api/Socket';
import { useChunkProcessor } from '../../hooks/ChunkController';

const Live = () => {

    const location = useLocation();

    let lstate = location?.state
    let fileId = lstate?.fileId || null
    let file = lstate?.file || null
    let panels = lstate?.panels || null

    const [data, setData] = useState(null)

    const { connectWebsocket} = useWebSocket( fileId, setData );  
    const { chunkProcessor } = useChunkProcessor();


    useEffect(() => {
        window.onbeforeunload = function () {
            localStorage.setItem("reloaded", true)
            console.log("setting reload!")
            return true;
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        connectWebsocket()
        chunkProcessor(file, fileId)
    }, []) 

    useEffect(() => {
        console.log(data)
    },[data]) 
    
    return (
        <Section id="result">
               <Container>
                    {data? 
                <ResultCard result={data}/>
                :
                null}
               </Container>
        </Section>
    )
}

export default Live;