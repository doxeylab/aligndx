import { useMemo, useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from "react-bootstrap/Spinner"
import ConfirmationModal from '../../../components/Modals/ConfirmationModal'
import { 
    CardElement,
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

const UpdateStripeCardElement = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setErrorMessage(null)

        // Make sure stripe & elements exist
        if (!stripe || !elements) return;
        
        setIsLoading(true);

        // Reference to mounted Card Element
        const cardNumberElement = elements.getElement(CardElement);
        
        // Use card Element to tokenize payment details
        let { error, setupIntent } = await stripe.confirmCardSetup(props.clientSecret, {
            payment_method: {
                card: cardNumberElement,
                billing_details: {
                    name: ''
                }
            }
        })

        if (error) {
            setIsLoading(false);
            setErrorMessage(error.message);
        }

        if (setupIntent && setupIntent.status === 'succeeded') {
            setIsLoading(false);
            props.success();
        }
    }

    const handleHideModal = () => {
        setErrorMessage(null)
        props.hideModal(false)
    }

    return (
        <>
            <ConfirmationModal 
                open={openSuccessModal}
                title={'Awesome'}
                body={'Requested changes were successful.'}
                onClose={setOpenSuccessModal}
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
                                Card Details:
                            </label>
                            <CardElement options={options}/>
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
                            {isLoading ? <Spinner className='mr-4' as="span" animation="border" /> : 'Update Card'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default UpdateStripeCardElement;