import React from 'react';
import BaseModal from "./BaseModal";

// Components 
import ResultCardComponent from '../CardComponents/ResultCardComponent';

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
                            {props.data ? props.data.map(
                                (result) => <ResultCardComponent>{result}</ResultCardComponent>)
                                :
                                ""
                            }
                        </Col>
                    </Row>
                </Container>
            }
        ></BaseModal>
    );
}

export default RestartModal;