import { useMemo, useState } from 'react';
import { withRouter } from "react-router-dom";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from "react-bootstrap/Spinner"

import './stripeCardElement.css';
import ConfirmationModal from '../../../components/Modals/ConfirmationModal'
import { 
    CardCvcElement, 
    CardExpiryElement, 
    CardNumberElement, 
    useStripe, 
    useElements
} from "@stripe/react-stripe-js";

// Stripe Elements iFrame Styling
const useOptions = () => {
    const options = useMemo(
      () => ({
        style: {
          base: {
            fontSize: "18px",
            color: "#101011",
            letterSpacing: "0.025em",
            fontFamily: "Source Code Pro, monospace",
            "::placeholder": {
              color: "#aab7c4"
            }
          },
          invalid: {
            color: "#f40a0"
          }
        }
      }),
      []
    );
  
    return options;
};

const StripeCardElement = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setErrorMessage(null)

        // Make sure stripe & elements exist
        if (!stripe || !elements) return;

        setIsLoading(true);
        
        // Reference to mounted Card Element
        const cardNumberElement = elements.getElement(CardNumberElement);
        
        // Use card Element to tokenize payment details
        let { error, paymentIntent } = await stripe.confirmCardPayment(props.clientSecret, {
            payment_method: {
                card: cardNumberElement,
                billing_details: {
                    name: name,
                    address: {
                        line1: props.address.line1,
                        line2: props.address.line2,
                        city: props.address.city,
                        state: props.address.state,
                        postal_code: props.address.postalCode,
                        country: props.address.country
                    }
                }
            }
        })

        if (error) {
            setIsLoading(false);
            setErrorMessage(error.message);
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            setIsLoading(false);
            setShowConfirmModal(true)
        }
    }

    const handleHideModal = () => {
        setErrorMessage(null)
        props.hideModal(false)
    }

    return (
        <>
            <ConfirmationModal 
                open={showConfirmModal}
                title={'Awesome'}
                body={'Payment processed successfuly!'}
                path={'/'}
            />
            <Modal animation={false} show={props.showModal} onHide={handleHideModal} centered>
                <Form id="card-form" onSubmit={handlePayment}>
                    <Modal.Header>
                        <Modal.Title>Payment Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div sx={{ display: 'flex', justifyContent: 'left', mb: 3 }}>
                            {errorMessage && <p id='error-message'>{errorMessage}</p>}
                        </div>
                        <div className='card-element'>
                            <label>
                                Name on Card:
                            </label>
                            <Form.Control 
                                required
                                id='card-name'
                                type="text" 
                                onChange={(e) => setName(e.target.value)}
                                name="name"
                                value={name}
                                className='StripeElement'
                            />
                        </div>
                        <div className='card-element'>
                            <label>
                                Card Number:
                            </label>
                            <CardNumberElement options={options}/>
                        </div>
                        <div className='card-element'>
                            <label>
                                Card Expiry:
                            </label>
                            <CardExpiryElement options={options} />
                        </div>
                        <div className='card-element'>
                            <label>
                                CVC:
                            </label>
                            <CardCvcElement options={options} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', mx: 2}}>
                        <img 
                            src='https://cdn.brandfolder.io/KGT2DTA4/at/rvgw5pc69nhv9wkh7rw8ckv/Powered_by_Stripe_-_blurple.svg'
                            alt='stripe-logo'
                            height={35}
                        />
                        <Button
                            className='d-flex align-items-center'
                            disabled={!stripe || isLoading}
                            id='pay-button'
                            type='submit'
                        >
                            {isLoading ? <Spinner className='mr-4' as="span" animation="border" /> : 'Submit'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default withRouter(StripeCardElement)