import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line
import UploadService from "../services/FileUploadService";
import axios from 'axios';
// eslint-disable-next-line
import LoadingSpinner from './LoadingSpinner';



const FileUploader = () => {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // eslint-disable-next-line
  const [errorMessage, setErrorMessage] = useState('');
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [dropzoneActive, setDropzoneActive] = useState(false);

  const fileInputRef = useRef();
  // eslint-disable-next-line
  // const uploadModalRef = useRef();
  // // eslint-disable-next-line
  // const uploadRef = useRef();
  // // eslint-disable-next-line
  // const progressRef = useRef();

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
    if (fileInputRef.current.files.length) {
        handleFiles(fileInputRef.current.files);
    }
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const handleFiles = (files) => {
    for(let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
          setSelectedFiles(prevArray => [...prevArray, files[i]]);
      } else {
        files[i]['invalid'] = true;
        setSelectedFiles(prevArray => [...prevArray, files[i]]);
        setErrorMessage('File type not permitted');
        setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
      }
    }
  }

  const validateFile = (file) => {
    const fileType = file.name.split('.').pop()
    const validTypes = ['fastq'];
    if (validTypes.indexOf(fileType) === -1) {
        return false;
    }
    return true;
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
    const validFileIndex = validFiles.findIndex(e => e.name === name);
    const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
    const unsupportedFileIndex = unsupportedFiles.findIndex(e => e.name === name);
    validFiles.splice(validFileIndex, 1);
    selectedFiles.splice(selectedFileIndex, 1);
    setValidFiles([...validFiles]);
    setSelectedFiles([...selectedFiles]);
    if (unsupportedFileIndex !== -1) {
        unsupportedFiles.splice(unsupportedFileIndex, 1);
        setUnsupportedFiles([...unsupportedFiles]);
    }
  }

  const uploadFiles = () => {
    const formData = new FormData();
    validFiles.forEach(file => {
      formData.append('file', file)
    })
    axios.post('https://localhost:8080/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
          console.log('does this sill happen?')
          if (uploadPercentage === 100) {
            validFiles.length = 0;
            setValidFiles([...validFiles]);
            setSelectedFiles([...validFiles]);
            setUnsupportedFiles([...validFiles]);
          }
        }
      })
      .then(() => {
        window.location.href = "/result"
      })
      .catch(() => {
          console.log('ERROR')
      });
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
                multiple="multiple"
              />
              <div className="upload-icon"></div>
              Drag & Drop files here or click to upload
            </div>
          }
        </div>
      }

      <button disabled={selectedFiles.length ? false : true} className="file-upload-btn"  onClick={() => uploadFiles()}>Analyze</button>

      {loading ?
        <LoadingSpinner />
      :
        null
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