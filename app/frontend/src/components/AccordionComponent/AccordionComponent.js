import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const AccordionComponent = ({ summary, children}) => {

    return (
        <Accordion style={{ width: "100%" }} >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                {summary}
            </AccordionSummary>
            <AccordionDetails>
                        {children}
            </AccordionDetails>
        </Accordion>
    )
}

export default AccordionComponent;