// React
import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// external libraries
import axios from 'axios';
import Fade from 'react-reveal/Fade';

// Components
import { Section } from '../../Common/PageElement';
import Button from '../../Button';
import UploadModal from '../../Modals/UploadModal';
import RestartModal from '../../Modals/RestartModal';
import StartFile from '../../ChunkController/chunkStarter';

// Styling
import { Col, Container, Row } from 'react-bootstrap';
import HomePageArt from '../../../assets/HomePageArt.svg';
import './CustomModal.css';
import { HeroBody, HeroBtns, HeroBtns2, HeroCol, HeroImage, HeroText, HeroTitle } from './StyledHero';

// Context
import { LoadContext } from '../../../LoadContext';
import {useGlobalContext} from "../../../context-provider";

// Testing  

// Config
import { UPLOAD_URL, PANELS_URL} from '../../../services/Config';
import { STANDARD_RESULTS, CHUNKED_RESULTS, INCOMPLETE_URL } from '../../../services/Config';
import { Typography } from '@mui/material';

const Hero = (props) => {

    const history = useHistory()
    const context = useGlobalContext();

    const [showStandardUploadModal, setShowStandardUploadModal] = useState(false); 
    const [showLiveUploadModal, setShowLiveUploadModal] = useState(false); 
    const [showRestartModal, setShowRestartModal] = useState(false); 


    const [dataFiles, setDataFiles] = useState([]);
    const { setLoad } = useContext(LoadContext);
    const [selectedDetections, setSelectedDetections] = useState([]);

    const [options,setOptions] = useState([]);  
    const [restart,setRestart] = useState({
        restartflag: false,
        data: null
    });
    const [selectedRestartData, setSelectedRestartData] = useState(false);

    const check_unprocessed = () => {
        const token = localStorage.getItem("accessToken")
        const config = { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        axios.get(INCOMPLETE_URL, config)
            .then((res) => {
                const data = res.data 
                
                if (!showLiveUploadModal || !showStandardUploadModal) {
                    if (data.length !== 0) {
                        setRestart({ ...restart, restartflag: true, data: data})
                        setShowRestartModal(true)
                    }
                    else {
                        setRestart({ ...restart, restartflag: false, data: data})
                    }
                }
            })
    }
    
    const selectmenuoptions = () => {
        axios.get(PANELS_URL)
            .then((res) => {
                setOptions(res.data)
            })
    }

    const dataFileCallback = (file) => {
        setDataFiles(prevFiles => [...prevFiles, file])
    }

    const dataRemoveFileCallback = (fileName) => {
        const dataFileIndex = dataFiles.findIndex(e => e.name === fileName);
        dataFiles.splice(dataFileIndex, 1);
        setDataFiles([...dataFiles]);
    }

    const detectionCallback = (detections) => {
        setSelectedDetections(detections) 
    } 

    const upload = () => {
        setLoad(true) 

        if (context.authenticated == true) {
            const formData = new FormData();
  
            dataFiles.forEach(file => {
                formData.append('files', file)
            })
            selectedDetections.forEach(x => {
                formData.append("panel", x)
            })

            var resource = UPLOAD_URL
            const token = localStorage.getItem("accessToken")

            const config = { 
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: progressEvent => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                props.changeProgress(percentCompleted)
              }
            }

            axios.post(resource, formData, config)
                .then((res) => {
                    setLoad(false)
                    const fileId = res.data.File_ID;  
                    history.push({
                        pathname: "/results/#/?id=" + fileId,
                        state: {
                            response: res.data,
                            file: dataFiles[0],
                            panels: selectedDetections,
                            resource: STANDARD_RESULTS   
                        }
                    }
                    )
                })
                .catch(function (error) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });
        }
        else {  
            alert("Please sign in to use this service")
            setLoad(false) 
        }  
         
    }

    // const uploadchunked = () => {
    //     setLoad(true) 

    //     if (context.authenticated == true) {
    //         const formData = new FormData();
  
    //         dataFiles.forEach(file => {
    //             formData.append('files', file)
    //         })
    //         selectedDetections.forEach(x => {
    //             formData.append("panel", x)
    //         })
            
    //         const token = localStorage.getItem("accessToken")

    //         try {
    //             StartFile(token, dataFiles[0], selectedDetections)
    //                 .then(
    //                     (res) => {
    //                         setLoad(false)
    //                         const fileId = res.data.File_ID;
    //                         ChunkProcessor(token, dataFiles[0], selectedDetections, res.data)
    //                             .then(
    //                                 (res) => {
    //                                     history.push({
    //                                         pathname: "/results/#/?id=" + fileId,
    //                                         state: {
    //                                             response: res.data,
    //                                             file: dataFiles[0],
    //                                             panels: selectedDetections,
    //                                             resource: CHUNKED_RESULTS   
    //                                         }
    //                                     }
    //                                     )
    //                                 }
    //                             )
    //                     }
    //                 )
    //         }
    //         catch (e) {
    //             console.log(e)
    //         }
    //     }
    //     else {  
    //         alert("Please sign in to use this service")
    //         setLoad(false) 
    //     }  
         
    // }

    
    const uploadlive = () => {
        // setLoad(true) 

        if (context.authenticated == true) {
            const formData = new FormData();
  
            dataFiles.forEach(file => {
                formData.append('files', file)
            })
            selectedDetections.forEach(x => {
                formData.append("panel", x)
            })

            const token = localStorage.getItem("accessToken")  

            if (restart.restartflag && selectedRestartData) {
                const fileId = selectedRestartData.id
                const panels = selectedRestartData.meta[0]
                history.push({
                    pathname: "/live/#/?id=" + fileId,
                    state: {
                        file: dataFiles[0],
                        panels: panels,
                        fileId: fileId,
                        restartflag: restart.restartflag 
                }})

            }
            else {
                StartFile(token, dataFiles[0], selectedDetections)
                .then(
                    (res) => {
                        setLoad(false)
                        const fileId = res.data.File_ID;
                        history.push({
                            pathname: "/live/#/?id=" + fileId,
                            state: {
                                file: dataFiles[0],
                                panels: selectedDetections,
                                fileId: fileId,
                                restartflag: restart.restartflag  
                            }
                        }
                        )
                    }
                )
            }
            
                
            
        }

        else {  
            alert("Please sign in to use this service")
            setLoad(false) 
        }  
         
    }

    const handleShow = (modalstate) => {
        if (context.authenticated == true){
            modalstate(true);
        }
        else {
            alert("Please sign in to use this service")
        }
    }
        
    const handleClose = (modalstate) => modalstate(false);
 
    useEffect(() => {
        // useeffect runs on mount, so we need to simply re-run useeffect when context forces a re-render, and account for the scenario before that (useeffect runs twice)
        if (!context.authenticated) return;

        else {
            if (context.authenticated == true){
                check_unprocessed()
                console.log("checking unprocessed")
            }
            else {
                console.log("not authenticated, so could not check unprocessed")
            }
            selectmenuoptions();    
        }
    }, [context.authenticated])

    useEffect(() => {
        console.log(dataFiles)
    }, [dataFiles])
 
    useEffect(() => {
        if (selectedRestartData) {
            console.log(selectedRestartData.meta[0])
        }
        console.log(selectedRestartData)
    }, [selectedRestartData])

    useEffect(() => {
        if (restart.data) {
            console.log(restart.data)
        }
    }, [restart])
 
    return (
        <>
            <Section id="hero" center>
                <Container>
                    <Row>
                        <HeroCol sm={6}>
                            <Fade left duration={1000} delay={600} distance="30px">
                                <HeroBody>
                                    <HeroTitle>PATHOGEN<br />DETECTION</HeroTitle>
                                    <HeroText>Analyze your .fastq or .fastq.gz files with out streamlined RNA-seq pipeline. Alternatively, go through our examples for sample results.</HeroText>
                                    <HeroBtns>
                                        <Button onClick={() => handleShow(setShowStandardUploadModal)}>Standard</Button>
                                        <Button onClick={() => handleShow(setShowLiveUploadModal)}>Live</Button>
                                        <Button fill to="/result">Examples</Button>
                                    </HeroBtns>
                                </HeroBody>
                            </Fade>
                        </HeroCol>
                        <HeroCol sm={6}>
                            <Fade right duration={1000} delay={600} distance="30px">
                                <HeroImage className="Art" src={HomePageArt} alt="Art" />
                            </Fade>
                        </HeroCol>
                    </Row>
                    <Row>
                        <HeroCol>
                            <Fade left duration={1000} delay={600} distance="30px">
                                <HeroBtns2>
                                    <Button onClick={() => handleShow(setShowStandardUploadModal)}>Standard</Button>
                                    <Button onClick={() => handleShow(setShowLiveUploadModal)}>Live</Button>
                                    <Button fill to="/result">Example</Button>
                                </HeroBtns2>
                            </Fade>
                        </HeroCol>
                    </Row>
                </Container>
            </Section>
            <UploadModal
                show={showStandardUploadModal}
                onHide={() => handleClose(setShowStandardUploadModal)}

                selectedFiles={dataFiles}
                dataFileCallback={dataFileCallback}
                dataRemoveFileCallback={dataRemoveFileCallback}

                options={options}
                detectionCallback={detectionCallback}
                selectedDetections={selectedDetections}

                upload={upload}

                title={
                    <Typography variant='h4'>
                        Standard
                    </Typography>
                }
            ></UploadModal>
            <UploadModal
                show={showLiveUploadModal}
                onHide={() => handleClose(setShowLiveUploadModal)}

                selectedFiles={dataFiles}
                dataFileCallback={dataFileCallback}
                dataRemoveFileCallback={dataRemoveFileCallback}
                
                options={options}
                detectionCallback={detectionCallback}
                selectedDetections={selectedDetections}
                
                upload={uploadlive}
                
                title={
                    <Typography variant='h4'>
                        Live Uploads
                    </Typography>
                }
            ></UploadModal> 
            <RestartModal
                show={showRestartModal}
                onHide={() => handleClose(setShowRestartModal)}
                upload={uploadlive}
                data={restart.data}

                selectedFiles={dataFiles}
                dataFileCallback={dataFileCallback}
                dataRemoveFileCallback={dataRemoveFileCallback} 

                setSelectedRestartData={setSelectedRestartData}
            ></RestartModal>
        </>
    );
}

export default Hero;