import React, { useState } from 'react';
import BaseModal from "./BaseModal";
import { useQuery } from 'react-query'
import { usePayments } from '../../api/Payments'

// Components 
import { DropdownMenu} from '../DropdownMenu';
import UploadComponent from '../UploadComponent';
import Button from '../Button'
import DataProgressBar from '../DataProgressBar';

// Styling
import { Col, Container, Row } from 'react-bootstrap'; 
 

const UploadModal = (props) => {
    const payments = usePayments();
    const [subscription, setSubscription] = useState(null);
    const [dataPercentUsage, setDataPercentage] = useState(0.1);

    const onSuccess = (data) => {
        if (data) {
            setSubscription(data.data)
            if (data.data?.data_limit_mb) {
                const percentage = ((data.data.data_limit_mb - data.data.data_used) / data.data.data_limit_mb) * 100;
                percentage === 0 ? setDataPercentage(0.1) : setDataPercentage(percentage);
            }
        }
    }

    const onError = (error) => {
        if (error.response.data.detail) {
            console.error('Error Message: ', error.response.data.detail)
            return;
        }
        console.error(error)
    }

    // API returns an 'active' subscription or null if none found
    const {refetch, isLoading} = useQuery('get_active_subscription', () => payments.get_active_subscription(), {
        enabled: true,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onSuccess,
        onError: onError
    })

    return ( 
            <BaseModal
            show={props.show}
            onHide={props.onHide}
            title={props.title}
            body={
                <Container>
                        <Row style={{ marginBottom: '1.5rem' }}>
                            <Col>
                                Data remaining in Subscription Plan
                            </Col>
                            <Col>
                                <DataProgressBar percentage = {dataPercentUsage}/>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '1.5rem' }}>
                            <Col>
                                <UploadComponent
                                    fileCallback={props.dataFileCallback}
                                    selectedFiles={props.selectedFiles}
                                    removeCallback={props.dataRemoveFileCallback}
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '1.5rem' }}>
                                <DropdownMenu
                                    options={props.options}
                                    val="value"
                                    label="label"
                                    category="category"
                                    valueCallback={props.detectionCallback}
                                    placeholder="Select your pathogen(s)"
                                />
                        </Row>
                        <Row>
                            <Col>
                                <Button fill disabled={(props.selectedFiles).length === 0 || (props.selectedDetections).length === 0 ? true : false} onClick={props.upload}>Analyze</Button>
                            </Col>
                        </Row>
                    </Container>
            }
            ></BaseModal>
    );
}

export default UploadModal;