import { useState } from 'react';
import { useQuery } from 'react-query';
import { usePayments } from '../../../api/Payments';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import ConfirmActionModal from '../../../components/Modals/ConfirmActionModal';
import ConfirmationModal from '../../../components/Modals/ConfirmationModal';

const CancelPlan = (props) => {
    const payments = usePayments();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showConfirmModalReactivate, setShowConfirmModalReactivate] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const onSuccess = (data) => {
        if (data) {
            setShowConfirmModal(false);
            setShowSuccessModal(true);
            props.refreshData();
        }
    }

    const onReactivateSuccess = (data) => {
        if (data) {
            setShowConfirmModalReactivate(false);
            setShowSuccessModal(true);
            props.refreshData();
        }
    }

    const onError = (error) => {
        if (error.response.data.detail) {
            console.error('Error Message: ', error.response.data.detail);
            return;
        }
        console.error(error);
    }

    const cancelSubs = useQuery('cancel_subscription', () => payments.cancel_subscription(), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onSuccess,
        onError: onError
    })

    const reactivateSubs = useQuery('reactivate_subscription', () => payments.reactivate_subscription(), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onReactivateSuccess,
        onError: onError
    })

    return (
        <div className="custom-card">
            <ConfirmActionModal
                title='Are you sure?'
                body='Please click Yes to confirm changes.'
                open={showConfirmModal}
                onClose={setShowConfirmModal}
                isLoading={cancelSubs.isLoading}
                onYes={cancelSubs.refetch}
            />
            <ConfirmActionModal
                title='Are you sure?'
                body='Please click Yes to confirm changes.'
                open={showConfirmModalReactivate}
                onClose={setShowConfirmModalReactivate}
                isLoading={reactivateSubs.isLoading}
                onYes={reactivateSubs.refetch}
            />
            <ConfirmationModal 
                open={showSuccessModal}
                title={'Awesome'}
                body={'Requested changes were successful.'}
                onClose={setShowSuccessModal}
            />
            <div className='header'>
                <Row>
                    <Col>
                        <h2>Cancel Plan</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
                <Row>
                    {props.sub.auto_renew ?
                        <Col>
                            <Alert variant='info'>
                                <Alert.Heading style={{fontSize: '2rem'}}>Cancellation Request</Alert.Heading>
                                <p style={{fontSize: '1.6rem'}}>You may request to cancel anytime, however the cancellation is 
                                    effective at the end of current billing period.</p>
                            </Alert>
                        </Col>
                    :
                        <Col>
                            <Alert variant='info'>
                                <Alert.Heading style={{fontSize: '2rem'}}>We are sorry to see you go!</Alert.Heading>
                                <p style={{fontSize: '1.6rem'}}>Cancellation is effective at the end of current billing period.
                                    You may continue to use the service until {props.sub.current_period_end}.</p>
                                <hr />
                                <p style={{fontSize: '1.6rem'}}>You may undo cancellation request my clicking the undo button below.</p>
                            </Alert>
                        </Col>
                    }
                </Row>
                <Row>
                    {props.sub.auto_renew ?
                        <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                            <Button
                                style={{width: '100%', fontSize: '1.8rem'}}
                                variant="outline-primary"
                                onClick={() => setShowConfirmModal(true)}
                            >
                                Request Cancellation
                            </Button>
                        </Col>
                    :
                        <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                            <Button
                                style={{width: '100%', fontSize: '1.8rem'}}
                                variant="outline-primary"
                                onClick={() => setShowConfirmModalReactivate(true)}
                            >
                                Undo Cancellation
                            </Button>
                        </Col>
                    }
                </Row>
            </div>
        </div>
    );
}

export default CancelPlan;