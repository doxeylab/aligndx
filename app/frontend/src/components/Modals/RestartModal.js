import React from 'react';
import BaseModal from "./BaseModal";

// Components 
import RestartTable from '../TableComponents/RestartTable';

// Styling
import { Col, Container, Row } from 'react-bootstrap';


const RestartModal = (props) => {
    return (
        <BaseModal
            show={props.show}
            onHide={props.onHide}
            title="Looks like you have some incomplete uploads!"
            body={
                <Container>
                        {props.data ? 
                            <RestartTable data={props.data}/>
                            :
                            null
                        }
                </Container>
            }
        ></BaseModal>
    );
}

export default RestartModal;