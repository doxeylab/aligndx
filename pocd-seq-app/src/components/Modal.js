import React from 'react';
import Backdrop from "./Backdrop";

const Modal = (props) => {
    return (
        <>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <div
                className = "Modal"
                style={{
                    transform:props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity : props.show ? 1 : 0
                }}
            >
                {props.children}
            </div>
       </>
    );
};


export default Modal;