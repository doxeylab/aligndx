import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Fade from 'react-reveal/Fade';

import { Section } from '../../../components/Common/PageElement';
import Button from '../../../components/Button';
import UploadModal from '../../../components/Modals/UploadModal';
import { RestartModal } from '../../../containers/Restart';

import { Container, Row } from 'react-bootstrap';
import HomePageArt from '../../../assets/HomePageArt.svg';
import './CustomModal.css';
import { HeroBody, HeroBtns, HeroBtns2, HeroCol, HeroImage, HeroText, HeroTitle } from './StyledHero';

import { Typography } from '@mui/material';
import { useMeta } from '../../../api/Meta';
import { useUsers } from '../../../api/Users';

import {useChunkStarter} from '../../../hooks/ChunkController';
const Hero = (props) => {
    const navigate = useNavigate();
    
    const meta = useMeta();
    const users = useUsers();
    const { startfile } = useChunkStarter()

    const [showStandardUploadModal, setShowStandardUploadModal] = useState(false);
    const [showLiveUploadModal, setShowLiveUploadModal] = useState(false);
    const [showRestartModal, setShowRestartModal] = useState(false);

    const [dataFiles, setDataFiles] = useState([]);
    const [selectedDetections, setSelectedDetections] = useState([]);
    const [process, setProcess] = useState("");
    const [selectedRestartData, setSelectedRestartData] = useState(false);

    const [options, setOptions] = useState([]);
    const [restart, setRestart] = useState({
        restartflag: false,
        data: null
    });

    const check_unprocessed = () => {
        users.index_incomplete_submissions()
            .then((res) => {
                const data = res.data 

                if (!showLiveUploadModal || !showStandardUploadModal) {
                    if (data.length !== 0) {
                        setRestart({ ...restart, data: data})
                        setShowRestartModal(true)
                    }
                    else {
                        setRestart({ ...restart, restartflag: false})
                    }
                }
            })
    }

    const selectmenuoptions = () => {
        meta.get_panels()
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
        const formData = new FormData();

        dataFiles.forEach(file => {
            formData.append('files', file)
        })
        selectedDetections.forEach(x => {
            formData.append("panel", x)
        })

        if (restart.restartflag) {
            const fileId = selectedRestartData.id
            const panels = selectedRestartData.meta[0]
            navigate("/live/#/?id=" + fileId, {
                state: {
                    file: dataFiles[0],
                    panels: panels,
                    fileId: fileId,
                    restartflag: restart.restartflag
                }
            })
        }
        else {
            startfile.mutate({
                    file: dataFiles[0], 
                    panels: selectedDetections, 
                    process: process})
        }

    }

    const handleShow = (modalstate, process) => {
        modalstate(true);
        setProcess(process)
    }

    const handleClose = (modalstate) => {
        modalstate(false);
        setProcess('')
    } 

    useEffect(() => {
        selectmenuoptions();
        check_unprocessed();
    }, [])

    useEffect(() => {
        if (selectedRestartData) {
            setRestart({ ...restart, restartflag: true })
        }
    }, [selectedRestartData])

    return (
        <>
            <Section id="hero" center>
                <Container>
                    <Row>
                        <HeroCol sm={6}>
                            <Fade left duration={1000} delay={600} distance="30px">
                                <HeroBody>
                                    <HeroTitle>PATHOGEN<br />DETECTION</HeroTitle>
                                    <HeroText>Analyze your .fastq or .fastq.gz files with our streamlined pipeline. Alternatively, go through our examples for sample results.</HeroText>
                                    <HeroBtns>
                                        {/* <Button onClick={() => handleShow(setShowStandardUploadModal, "rna-seq")}>RNA-Seq</Button> */}
                                        <Button onClick={() => handleShow(setShowLiveUploadModal, "metagenomics")}>Upload</Button>
                                        <Button fill to="/examples">Examples</Button>
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
                                    {/* <Button onClick={() => handleShow(setShowStandardUploadModal)}>RNA-Seq</Button> */}
                                    <Button onClick={() => handleShow(setShowLiveUploadModal, "metagenomics")}>Upload</Button>
                                    <Button fill to="/examples">Example</Button>
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
                        RNA-Seq
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

                upload={upload}

                title={
                    <Typography variant='h4'>
                    </Typography>
                }
            ></UploadModal>
            <RestartModal
                show={showRestartModal}
                onHide={() => {
                    handleClose(setShowRestartModal)
                    handleClose(setSelectedRestartData)
                }}
                upload={upload}
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