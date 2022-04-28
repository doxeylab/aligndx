import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

// import ChunkProcessor from '../../containers/ChunkController/chunkProcessor'
import {ResultCard} from '../../containers/Results';

import { Grid } from '@mui/material';
import { Container } from '@mui/material';
import { Section, Title } from '../../components/Common/PageElement';

import { WEBSOCKET_URL } from '../../services/Config';

import exampledataset from './../../assets/test_datasets/example_dataset.json'

const Live = () => {

    const history = useHistory();
    const location = useLocation();

    const [data, setData] = useState(exampledataset); 
 
    const connectWebsocket = async (file_id, token) => {
        try { 
            console.log("trying websocket connection")
            const ws = new WebSocket(WEBSOCKET_URL + '/' + file_id)

            // ws.onerror = function (event) {
            //     console.log("didn't work")
            //     console.log(event)
            // }
            ws.onopen = function (event) {
                ws.send(token)
            }

            ws.onclose = function (event) {
                console.log("socket closed")
                console.log(event)
            }

            ws.onmessage = function (event) {
                const obj = JSON.parse(event.data)
                setData(obj)
            }
        }

        catch (err) {
            // Handle Error Here
            console.log("error")
            console.error(err);
        }
    };

    let lstate = location.state
    let fileId = null
    let restartflag = null
    let file = null
    let panels = null
    let reload_flag = false //localStorage.getItem("user_reloaded")

    useEffect(() => {
        if (!lstate) {
            history.push('/')
            return
        }

        if (reload_flag) {
            console.log("reloaded!")
            localStorage.removeItem("user_reloaded")
            fileId = lstate.fileId
            file = lstate.file
            panels = lstate.panels
            // ChunkProcessor(token, file, panels, fileId, true)
        }

        else {
            fileId = lstate.fileId
            restartflag = lstate.restartflag
            file = lstate.file
            panels = lstate.panels
            // ChunkProcessor(token, file, panels, fileId, restartflag)
        }
    }, [])


    const token = localStorage.getItem("accessToken")

    useEffect(() => {
        window.onbeforeunload = function () {
            localStorage.setItem("user_reloaded", true)
            console.log("setting reload!")
            return true;
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        connectWebsocket(fileId, token)
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