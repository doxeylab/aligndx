import React from 'react';
import Modal from "./Modal.js";
import FileUploader from './FileUploader/FileUploader.js';

const FileUpload = (props) => {
  return (
    <div className="uploadModal--container">
      <Modal show={props.show} modalClosed={props.modalToggle}>
        <i className="fas fa-times fa-lg" onClick={props.modalToggle}></i>
        <h1>Upload your Sequence</h1>
        <FileUploader spinnerCallback={props.closeSpinnerCallback} parentCallback={props.parentCallback}/>
      </Modal>
    </div>
  );
}

export default FileUpload