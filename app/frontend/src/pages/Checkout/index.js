// React
import { useState, useEffect } from 'react'
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
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [validated, setValidated] = useState(false);
    const [taxRate, setTaxRate] = useState(0);
    const [address, setAddress] = useState({
        company: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'CA'
    });
    const selectedPlanName = new URLSearchParams(search).get('plan_name');

    useEffect(() => {
        // Select plan based on selected Canadian province's tax rate
        // Effect is triggered by changing Canadian province and its corresponding tax rate
        const plan = plans.find(p => p.name === selectedPlanName && p.tax_rate === taxRate);
        setSelectedPlan(plan)
    }, [taxRate, selectedPlanName, plans]);

    const onPlansSuccess = (data) => {
        if (data) setPlans(data.data.plans);
    }

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
    
    // Create new inactive subscription based on selected plan id
    const {refetch, isLoading} = useQuery('new_subscription', () => payments.create_subscription({plan_id: selectedPlan.id}), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onSuccess,
        onError: onError
    })

    // Fetch all available plans
    useQuery('get_all_plans', () => payments.get_all_plans(), {
        enabled: true,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onPlansSuccess,
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
                                setTaxRate={setTaxRate}
                                submit={handleAddressForm}
                            />
                            <StripeCardElement
                                showModal={showPaymentModal}
                                hideModal={setShowPaymentModal}
                                clientSecret={clientSecret}
                                address={address}
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
                        { selectedPlan &&
                            <div className='paper'>
                                <OrderSummary plan={selectedPlan} />
                            </div>
                        }
                    </Col>
                </Row>
            </Container>
        </Section>
    )
}

export default Checkout;