// external libraries 
import Modal from 'react-bootstrap/Modal';  
 
const BaseModal = (props) => { 

    return ( 
            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={props.show}
                onHide={props.onHide}
                scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    {props.body}
                </Modal.Body>
            </Modal>
    );
}

export default BaseModal;