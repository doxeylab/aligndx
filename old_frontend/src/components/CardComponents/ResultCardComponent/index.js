import React from 'react';

//Styled Components
import {ResultHeader, ResultName, UploadDate, PathogenType, ChevronIcon} from './StyledResultCard';
import { Col, Container, Row } from 'react-bootstrap';

// import {FaChevronRight} from 'react-icons/fa';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

import Barchart from '../../BarChart';

const ResultCardComponent = (props) => {
    const data = [JSON.parse(props.data)] 

    return (
            <Accordion style={{ width: "100%" }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Col>
                        <ResultName>{props.name}</ResultName>
                    </Col>
                    <Col>
                        <UploadDate>{props.uploadDate}</UploadDate>
                    </Col>
                    <Col>
                        <PathogenType>{props.pathogenType}</PathogenType>
                    </Col>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {data ?
                            data.map((d) => (

                                <div className='barGraph'>
                                    <Barchart data={d} yLabel={d.ylabel} xLabel={d.xlabel} col="coverage" xkey="pathogen" ykey="coverage" />
                                </div>
                            ))
                                :
                                <div>
                                    INCOMPLETE
                                </div>
                        }
                    </Typography>
                </AccordionDetails>
            </Accordion>


    )
}

export default ResultCardComponent