// React
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

// Custom CSS
import './checkoutStyles.css';

import { Section } from '../../components/Common/PageElement'
import StripeCardElement from '../../containers/Payments/StripeCardElement'
import AddressForm from '../../containers/Payments/AddressForm'
import OrderSummary from '../../containers/Payments/OrderSummary'
import { usePayments } from '../../api/Payments'

const Checkout = () => {
    const { search } = useLocation();
    const payments = usePayments();
    const [showPaymentModal, setShowPaymentModal] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [validated, setValidated] = useState(false);
    const [address, setAddress] = useState({
        company: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'CA'
    });
    const onSuccess = (data) => {
        if (data) {
            setClientSecret(data.data.client_secret)
            setShowPaymentModal(true)
        }
    }
    const onError = (error) => {
        if (error.response.data.detail) {
            console.error('Error Message: ', error.response.data.detail)
            return;
        }
        console.error(error)
    }
    const plan_id = new URLSearchParams(search).get('plan_id')
    const {refetch, isLoading} = useQuery('new_subscription', () => payments.create_subscription({plan_id: plan_id}), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onSuccess,
        onError: onError
    })
    const handleAddressForm = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        if (form.checkValidity() === true) {
            event.preventDefault();
            refetch()
        }
    }
    return (
        <Section id='checkout-page'>
            <Container>
                <Row>
                    <Col xs={12} md={7} id='checkout-form-container'>
                        <div className='paper'>
                            <AddressForm
                                address={address}
                                setAddress={setAddress}
                                validated={validated}
                                submit={handleAddressForm}
                            />
                            <StripeCardElement
                                showModal={showPaymentModal}
                                hideModal={setShowPaymentModal}
                                clientSecret={clientSecret}
                                address={address}
                                plan_id={plan_id}
                            />
                            <div className='box mt-5'>
                                <Button
                                    variant='primary'
                                    size='lg'
                                    style={{fontSize: '18px'}}
                                    disabled={isLoading}
                                    type='submit'
                                    form='address-form'
                                >
                                    {isLoading ? 
                                        <>
                                            <Spinner as="span"
                                                animation="border"
                                                size="lg"
                                            />
                                            <span>Loading...</span>
                                        </>
                                    : 
                                        "Payment Details"}
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={5}>
                        <div className='paper'>
                            <OrderSummary />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Section>
    )
}

export default Checkout;