import React from 'react';
import BaseModal from "../../components/Modals/BaseModal";

// Components 
import RestartTable from './RestartTable';

// Styling
import { Col, Container, Row } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';

const RestartModal = (props) => {
    return (
        <BaseModal
            show={props.show}
            onHide={props.onHide}
            title={
                <Box>
                    <Typography variant="h4" sx={{ margin: 1 }}>
                        Incomplete Uploads
                    </Typography>
                    <Typography sx={{ margin: 1 }}>
                        Looks like you have some incomplete uploads!. Select an entry to continue your upload, otherwise exit for a new submission!
                    </Typography>

                </Box>
            }

            body={
                <Container>
                     
                    <Row style={{ marginBottom: '1.5rem' }}>
                        {props.data ? 
                            <RestartTable 
                            data={props.data}
                            upload={props.upload}
                            dataFileCallback={props.dataFileCallback}

                            selectedFiles={props.selectedFiles}
                            dataRemoveFileCallback={props.dataRemoveFileCallback}

                            setSelectedRestartData={props.setSelectedRestartData}
                            />
                            :
                            null
                        }
                    </Row> 
                </Container>
                
            }
        ></BaseModal>
    );
}

export default RestartModal;