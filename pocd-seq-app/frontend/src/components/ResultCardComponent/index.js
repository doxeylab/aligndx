import React from 'react';
//Styled Components
import {ResultCard, ResultName, UploadDate, PathogenType, ChevronIcon} from './StyledResultCard';
import {FaChevronRight} from 'react-icons/fa';

const ResultCardComponent = () => {
    return (
        <ResultCard>
            <ResultName>SRR11365240</ResultName>
            <UploadDate>Wed, Jun 30, 2021 12:07</UploadDate>
            <PathogenType>Sars CoV-2</PathogenType>
            <ChevronIcon>
                <FaChevronRight />
            </ChevronIcon>
        </ResultCard>
    )
}

export default ResultCardComponent