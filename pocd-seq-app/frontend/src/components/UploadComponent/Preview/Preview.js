// React
import React, {useState} from 'react';
// Styles
import {PreviewContainer, PreviewItem, PreviewFileType, PreviewFileName, PreviewFileSize, PreviewFileRemove} from './StyledPreview';
// Assets
import FileIcon from '../../../assets/generic.png';

const Preview = ({files, removeFileCallback}) => {
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

    return (
        <PreviewContainer>
            {files.map((data, i) => 
                <PreviewItem>
                    <img src={FileIcon} style={{width:'50px',height:'50px'}}/>
                    <PreviewFileType>{fileType(data.name)}</PreviewFileType>
                    <PreviewFileName>{data.name}</PreviewFileName>
                    <PreviewFileSize>{fileSize(data.size)}</PreviewFileSize>
                    <PreviewFileRemove onClick={() => removeFileCallback(data.name)}>
                        <i className="fas fa-times fa-lg"></i>
                    </PreviewFileRemove>
                </PreviewItem>
            )}
        </PreviewContainer>
    );
}

export default Preview;
