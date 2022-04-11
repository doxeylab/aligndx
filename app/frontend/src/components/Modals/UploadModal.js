import React from 'react';
import BaseModal from "./BaseModal";


// Components 
import { DropdownMenu} from '../Form';
import UploadComponent from '../UploadComponent';
import Button from '../Button'
import DataProgressBar from '../DataProgressBar';

// Styling
import { Col, Container, Row } from 'react-bootstrap'; 
 

const UploadModal = (props) => { 
    const dataPercentUsage = 70;
    return ( 
            <BaseModal
            show={props.show}
            onHide={props.onHide}
            title={props.title}
            body={
                <Container>
                        <Row style={{ marginBottom: '1.5rem' }}>
                            <Col>
                                <DataProgressBar caption = "Data Remaining in Subscription Plan" percentage = {dataPercentUsage}/>
                            </Col>
                        </Row>
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
            }
            ></BaseModal>
    );
}

export default UploadModal;