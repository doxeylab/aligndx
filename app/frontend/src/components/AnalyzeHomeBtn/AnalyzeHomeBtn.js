import React, { useState } from 'react'
import FileUpload from '../FileUpload';
import LoadingSpinner from '../LoadingSpinner';

const AnalyzeHomeBtn = () => {

    const [toggleUploadModal, setToggleUploadModal] = useState(false)
    const [toggleLoader, setToggleLoader] = useState(false)

    const callback = () => {
        setToggleUploadModal(false)
    }

    const spinnerCallback = (loaderState) => {
        setToggleLoader(loaderState)
    }

    return (
        <>
        <div>
            <button
                id="analyzeHomeBtnTest"
                className="cta-btn--analyze"
                onClick={(e) => { e.preventDefault(); setToggleUploadModal(!toggleUploadModal); }}
            >Analyze Now
            </button>
            
        </div>
        <FileUpload closeSpinnerCallback={spinnerCallback} parentCallback={callback} show={toggleUploadModal} modalToggle={(e) => { e.preventDefault(); setToggleUploadModal(!toggleUploadModal); }} />
        {toggleLoader ? <LoadingSpinner/> : ''}
    
        </>
    );
}

export default AnalyzeHomeBtn;