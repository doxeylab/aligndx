import React from 'react';
//Styled Components
import {ResultCard, ResultName, UploadDate, PathogenType, ChevronIcon} from './StyledResultCard';
import {FaChevronRight} from 'react-icons/fa';

const ResultCardComponent = (props) => {
    
    return (
        <ResultCard>
            <ResultName>{props.name}</ResultName>
            <UploadDate>{props.uploadDate}</UploadDate>
            <PathogenType>{props.pathogenType}</PathogenType>
            <ChevronIcon>
                <FaChevronRight />
            </ChevronIcon>
        </ResultCard>
    )
}

export default ResultCardComponent