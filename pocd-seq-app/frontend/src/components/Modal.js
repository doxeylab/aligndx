import React from 'react';
import Backdrop from "./Backdrop";

const Modal = (props) => {
    return (
        <div>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <div className="ModalContainer">
                <div
                    className="Modal"
                    style={{
                        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: props.show ? 1 : 0
                    }}
                >
                    {props.children}
                </div>
            </div>
        </div>
    );
};


export default Modal;