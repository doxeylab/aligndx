  
import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line
import UploadService from "../services/FileUploadService";
import axios from 'axios';
import ResultAnalysis from './ResultAxios';
import LoadingSpinner from './LoadingSpinner';



const FileUploader = () => {

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState('');
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [dropzoneActive, setDropzoneActive] = useState(false);

  const fileInputRef = useRef();
  // eslint-disable-next-line
  const uploadModalRef = useRef();
  // eslint-disable-next-line
  const uploadRef = useRef();
  // eslint-disable-next-line
  const progressRef = useRef();

  useEffect(() => {
    let filteredArray = selectedFiles.reduce((file, current) => {
        const x = file.find(item => item.name === current.name);
        if (!x) {
            return file.concat([current]);
        } else {
            return file;
        }
    }, []);
    setValidFiles([...filteredArray]);

  }, [selectedFiles]);

  const validateFile = (file) => {
    const fileType = file.name.split('.').pop()
    const validTypes = ['fastq'];
    if (validTypes.indexOf(fileType) === -1) {
        return false;
    }
    return true;
  }

  const handleFiles = (files) => {
    for(let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
          // add to an array so we can display the name of file
          setSelectedFiles(prevArray => [...prevArray, files[i]]);
          setUnsupportedFiles([])
      } else {
        setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
          // // add a new property called invalid
          // files[i]['invalid'] = true;
          // // add to the same array so we can display the name of the file
          // setSelectedFiles(prevArray => [...prevArray, files[i]]);
          // // set error message
          // setErrorMessage('File type not permitted');
          // setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
      }
    }
  }

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

  const fileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  const removeFile = (name) => {
    // find the index of the item
    // remove the item from array

    const validFileIndex = validFiles.findIndex(e => e.name === name);
    validFiles.splice(validFileIndex, 1);
    // update validFiles array
    setValidFiles([...validFiles]);
    const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
    selectedFiles.splice(selectedFileIndex, 1);
    // update selectedFiles array
    setSelectedFiles([...selectedFiles]);
    const unsupportedFileIndex = unsupportedFiles.findIndex(e => e.name === name);
    if (unsupportedFileIndex !== -1) {
        unsupportedFiles.splice(unsupportedFileIndex, 1);
        // update unsupportedFiles array
        setUnsupportedFiles([...unsupportedFiles]);
    }
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
        handleFiles(fileInputRef.current.files);
    }
  }

  const uploadFiles = () => {
    setLoading(true)
    /*
    uploadModalRef.current.style.display = 'block';
    uploadRef.current.innerHTML = 'File(s) Uploading...';
    */
    for (let i = 0; i < validFiles.length; i++) {
      const formData = new FormData();
      formData.append('file', validFiles[i]);
      formData.append('key', 'add your API key here');
      axios.post('http://localhost:8080/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
          /*
          progressRef.current.innerHTML = `${uploadPercentage}%`;
          progressRef.current.style.width = `${uploadPercentage}%`;
          */
          if (uploadPercentage === 100) {
            setLoading(false)
            /*uploadRef.current.innerHTML = 'File(s) Uploaded';*/
            validFiles.length = 0;
            setValidFiles([...validFiles]);
            setSelectedFiles([...validFiles]);
            setUnsupportedFiles([...validFiles]);
            window.location.href = 'http://www.google.com';
          }
        }
      })
      /*
      .catch(() => {
          // If error, display a message on the upload modal
          uploadRef.current.innerHTML = `<span class="error">Error Uploading File(s)</span>`;
          // set progress bar background color to red
          progressRef.current.style.backgroundColor = 'red';
      });
      */
    }
  }

  /*
  {const closeUploadModal = () => {
    uploadModalRef.current.style.display = 'none';
  }
  */

  return (
    <div>
      {selectedFiles.length ? 
        <div className="file-display-container">
          <div className="file-display-content">
            {
              validFiles.map((data, i) => 
                <div className="file-status-bar" key={i}>
                  <div>
                    <div className="file-type-logo"></div>
                    <div className="file-type">{fileType(data.name)}</div>
                    <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                    <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                  </div>
                  <div className="file-remove" onClick={() => removeFile(data.name)}>
                    <i className="fas fa-times fa-lg"></i>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        :
        <div className={dropzoneActive ? 'drop-container--dropzoneActive' : 'drop-container'}
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          onClick={fileInputClicked}
        >
          {unsupportedFiles.length ? 
            <div className="drop-message-error">
              <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                accept=".fastq"
                onChange={filesSelected}
              />
              <div className="upload-icon"></div>
              Please only upload FASTQ files!
            </div>
          :
            <div className="drop-message">
              <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                accept=".fastq"
                onChange={filesSelected}
              />
              <div className="upload-icon"></div>
              Drag & Drop files here or click to upload
            </div>
          }
        </div>
      }

      <button disabled={selectedFiles.length ? false : true} className="file-upload-btn" onClick={() => uploadFiles()}>Analyze</button>

      {loading ?
        <LoadingSpinner />
      :
        <ResultAnalysis />
      }

      {/*<div className="upload-modal" ref={uploadModalRef}>
        <div className="close" onClick={(() => closeUploadModal())}>X</div>
        <div className="progress-container">
          <span ref={uploadRef}></span>
          <div className="progress">
            <div className="progress-bar" ref={progressRef}></div>
          </div>
        </div>
    </div>*/}

    </div>
  );
};

export default FileUploader;