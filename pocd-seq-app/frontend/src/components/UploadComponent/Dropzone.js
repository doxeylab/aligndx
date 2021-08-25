import React, { useState, useRef } from "react";
import {Dropzone, DropzoneInput, DropzoneMessage, DropzoneTitle} from './StyledDropzone';
import Preview from './Preview/Preview';

const FileUploader = ({ fileCallback, selectedFiles, removeCallback }) => {
  const [dropzoneActive, setDropzoneActive] = useState(false);

  const fileInputRef = useRef();

  const dragOver = (e) => {
    e.preventDefault();
  }

  const dragEnter = (e) => {
    setDropzoneActive(!dropzoneActive)
    e.preventDefault();
  }

  const dragLeave = (e) => {
    setDropzoneActive(!dropzoneActive)
    e.preventDefault();
  }

  const fileDrop = (e) => {
    setDropzoneActive(!dropzoneActive)
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }

  const filesSelected = () => {
    handleFiles(fileInputRef.current.files);
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

    const handleFiles = (files) => {
        for(let i = 0; i < files.length; i++) {
            fileCallback(files[i])
        }
    }

  return (
    <div>
      {selectedFiles.length ?
        <Preview files={selectedFiles} removeFileCallback={removeCallback} />
        :
        <Dropzone
            active={dropzoneActive}
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          onClick={fileInputClicked}
        >
            <DropzoneMessage>
                <DropzoneInput
                    multiple
                    type="file"
                    ref={fileInputRef}
                    onChange={filesSelected}
                />
              <div className="upload-icon"></div>
              Drag & Drop files here or click to upload
            </DropzoneMessage>
          </Dropzone>
      }
    </div>
  );
};

export default FileUploader;