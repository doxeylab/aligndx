// React
import React, { useContext, useState } from 'react';

// external libraries 
import Modal from 'react-bootstrap/Modal'; 

// Components 
import { DropdownMenu, TextField } from '../Form';
import UploadComponent from '../UploadComponent';
import Button from '../Button'

// Styling
import { Col, Container, Row } from 'react-bootstrap'; 
import './CustomModal.css';  
 

const UploadModal = (props) => { 

    return ( 
            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={props.show}
                onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Container>
                        <Row style={{ marginBottom: '1.5rem' }}>
                            <Col>
                                <UploadComponent
                                    fileCallback={props.dataFileCallback}
                                    selectedFiles={props.selectedFiles}
                                    removeCallback={props.dataRemoveFileCallback}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '1.5rem' }}>
                                <DropdownMenu
                                    options={props.options}
                                    val="value"
                                    label="label"
                                    category="category"
                                    valueCallback={props.detectionCallback}
                                    placeholder="Select your pathogen(s)"
                                />
                        </Row>
                        <Row>
                            <Col>
                                <Button fill disabled={(props.selectedFiles).length === 0 || (props.selectedDetections).length === 0 ? true : false} onClick={props.upload}>Analyze</Button>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
    );
}

export default UploadModal;