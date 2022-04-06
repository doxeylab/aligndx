// React
import { useState } from 'react'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

// Custom CSS
import './checkoutStyles.css';

import { Section } from '../../components/Common/PageElement'
import StripeCardElement from '../../containers/Payments/StripeCardElement'
import AddressForm from '../../containers/Payments/AddressForm'
import OrderSummary from '../../containers/Payments/OrderSummary'

const Checkout = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [address, setAddress] = useState({
        line1: '1000 Front St. E',
        line2: 'Suite 1003',
        city: 'Toronto',
        state: 'Ontario',
        postalCode: 'M4H 3N8',
        country: 'CA'
    });

    return (
        <Section id='checkout-page'>
            <Container>
                <Row>
                    <Col xs={12} md={7} id='checkout-form-container'>
                        <div className='paper'>
                            <AddressForm address={address} setAddress={setAddress} />
                            <StripeCardElement showModal={showPaymentModal} hideModal={setShowPaymentModal} />
                            <div className='box mt-5'>
                                <Button variant='primary' size='lg' style={{fontSize: '18px'}} onClick={() => setShowPaymentModal(true)}>
                                    Payment Details
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