import { useState } from 'react';
import { useQuery } from 'react-query'
import { usePayments } from '../../../api/Payments'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"

import UpdateStripeCardElement from '../../Payments/UpdateStripeCardElement';
import ConfirmationModal from '../../../components/Modals/ConfirmationModal'

const PaymentMethod = (props) => {
    const payments = usePayments();
    const [showStripeModal, setShowStripeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);

    const onSuccess = (data) => {
        if (data) {
            setClientSecret(data.data.client_secret)
            setShowStripeModal(true)
        }
    }

    const onError = (error) => {
        if (error.response.data.detail) {
            console.error('Error Message: ', error.response.data.detail)
            return;
        }
        console.error(error)
    }

    const {refetch, isLoading} = useQuery('update_payment_method', () => payments.update_payment_method(), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onSuccess,
        onError: onError
    })

    const onCardUpdateSuccess = () => {
        setShowStripeModal(false);
        setShowSuccessModal(true);
    }

    return (
        <div className="custom-card">
            <div className='header'>
                <Row>
                    <Col>
                        <h2>Update Payment Method</h2>
                    </Col>
                </Row>
            </div>
            <div  className='main-content'>
                <UpdateStripeCardElement
                    showModal={showStripeModal}
                    hideModal={setShowStripeModal}
                    clientSecret={clientSecret}
                    success={onCardUpdateSuccess}
                />
                <ConfirmationModal 
                    open={showSuccessModal}
                    title={'Awesome'}
                    body={'Credit Card updated successfully.'}
                    onClose={() => {
                        props.refreshData();
                        setShowSuccessModal(false)
                    }}
                />
                <Row>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Current Payment Method:</span></Col>
                    <Col sm={7}><h4>{props.customer.payment_card_type.toUpperCase()}</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Card Number:</span></Col>
                    <Col sm={7}><h4>•••• •••• •••• {props.customer.card_last4}</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Expiry:</span></Col>
                    <Col sm={7}><h4>{props.customer.card_expiry}</h4></Col>
                    <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                    <Button
                        className='d-flex align-items-center justify-content-center'
                        style={{width: '100%', fontSize: '1.8rem'}}
                        variant="outline-primary"
                        onClick={refetch}
                        disabled={isLoading}
                    >
                        {isLoading ?
                            <>
                                <Spinner className='mr-4' as="span" animation="border" />
                                Loading...
                            </> 
                        : 'Update Card'}
                    </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default PaymentMethod;