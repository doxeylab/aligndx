import React from 'react';
import BaseModal from "./BaseModal";

// Components 
import UploadComponent from '../UploadComponent';
import Button from '../Button'

// Styling
import { Col, Container, Row } from 'react-bootstrap'; 
 

const RestartModal = (props) => { 
    return ( 
            <BaseModal
            show={props.show}
            onHide={props.onHide}
            title="Incomplete Uploads"
            body={
                <Container> 
                        <Row style={{ marginBottom: '1.5rem' }}>
                            <Col>
                            {props.data}
                            </Col>
                        </Row>
                    </Container>
            }
            ></BaseModal>
    );
}

export default RestartModal;