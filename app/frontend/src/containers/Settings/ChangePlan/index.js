import { useState } from 'react'
import { useQuery } from 'react-query'
import { usePayments } from '../../../api/Payments'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import ConfirmActionModal from '../../../components/Modals/ConfirmActionModal'
import ConfirmationModal from '../../../components/Modals/ConfirmationModal'

const ChangePlan = (props) => {
    const payments = usePayments();
    const [plans] = useState(props.plans);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isUpgrade, setIsUpgrade] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [openConfirmModalCancelChange, setOpenConfirmModalCancelChange] = useState(false);

    const handleChange = (event) => {
        const {name, value} = event.target

        if (name === 'plan' && value !== '') {
            const plan = plans.find(p => p.id === value)
            if (plan.base_price >= props.current_plan.base_price) {
                setIsUpgrade(true)
            } else {
                setIsUpgrade(false)
            }
            setSelectedPlan(plan)
        } else {
            setSelectedPlan(null)
        }
    }

    const onSuccess = (data) => {
        if (data) {
            setOpenConfirmModal(false)
            setOpenSuccessModal(true)
            setSelectedPlan(null)
            props.refreshData()
        }
    }

    const onCancelChangeSuccess = (data) => {
        if (data) {
            setOpenConfirmModalCancelChange(false)
            setOpenSuccessModal(true)
            props.refreshData()
        }
    }

    const onError = (error) => {
        console.log(error.response)
        if (error.response.status === 402) {
            setOpenConfirmModal(false);
            setErrorMessage('Your credit card declined. Please update your payment method before upgrading the plan.');
        }
        if (error.response.data.detail) {
            console.error('Error Message: ', error.response.data.detail)
            return;
        }
        console.error(error)
    }

    const changePlan = useQuery('change_plan', () => payments.change_plan({plan_id: selectedPlan.id}), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onSuccess,
        onError: onError
    })

    const cancelChangePlan = useQuery('cancel_change_plan', () => payments.cancel_change_plan(), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false,
        onSuccess: onCancelChangeSuccess,
        onError: onError
    })

    const handleChangePlan = () => {
        setOpenConfirmModal(true)
    }

    const handleCancelChangePlan = () => {
        setOpenConfirmModalCancelChange(true)
    }

    return (
        <div className="custom-card">
            {/* Modal for Change Plan */}
            <ConfirmActionModal
                title='Are you sure?'
                body='Please click Yes to confirm changes.'
                open={openConfirmModal}
                onClose={setOpenConfirmModal}
                isLoading={changePlan.isLoading}
                onYes={changePlan.refetch}
            />
            {/* Modal for Cancelling Plan Downgrade */}
            <ConfirmActionModal
                title='Are you sure?'
                body='Please click Yes to confirm changes.'
                open={openConfirmModalCancelChange}
                onClose={setOpenConfirmModalCancelChange}
                isLoading={cancelChangePlan.isLoading}
                onYes={cancelChangePlan.refetch}
            />
            <ConfirmationModal 
                open={openSuccessModal}
                title={'Awesome'}
                body={'Requested changes were successful.'}
                onClose={setOpenSuccessModal}
            />
            <div className='header'>
                <Row>
                    <Col>
                        <h2>Change Plan</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
                {errorMessage && 
                    <Row>
                        <Col sm={12}>
                            <Alert variant='danger'>
                                <Alert.Heading style={{fontSize: '2rem'}}>Payment Error</Alert.Heading>
                                <p style={{fontSize: '1.6rem'}}>{errorMessage}</p>
                            </Alert>
                        </Col>
                    </Row>
                }
                {!props.scheduled_plan ? <>
                    <Row>
                        <Col sm={5}><span style={{fontSize: '1.5rem'}}>Select New Plan:</span></Col>
                        <Col sm={7}>
                            <Form.Control
                                style={{fontSize: '1.5rem'}}
                                as='select'
                                name="plan"
                                onChange={handleChange}
                            >
                                <option key={''} value={''}>--- Select a Plan ---</option>
                                {plans.map(plan => (
                                    <option key={plan.id} value={plan.id}>{plan.description}</option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Row>
                    {selectedPlan && 
                        <Row style={{marginTop:'16px'}}>
                            <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Data Allowance:</span></Col>
                            <Col sm={7}><h4>{(selectedPlan.data_limit_mb/1000)} gb</h4></Col>
                            <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Price:</span></Col>
                            <Col sm={7}>
                                <h4>
                                    C$ {parseFloat(selectedPlan.base_price/100).toFixed(2)} + Tax({selectedPlan.tax_rate}%)
                                </h4>
                            </Col>
                            <Col sm={12} style={{marginTop:'16px'}}>
                                <Alert variant='info'>
                                    <p style={{fontSize: '1.6rem'}}>
                                        {isUpgrade ?
                                            'Upgrading to new plan will take effect immediately.'
                                        :
                                            'Downgrading to new plan will take effect starting next billing cycle.'
                                        }
                                    </p>
                                </Alert>
                            </Col>
                            <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                                <Button
                                    style={{width: '100%', fontSize: '1.8rem'}}
                                    variant="outline-primary"
                                    onClick={handleChangePlan}
                                >
                                    Change Plan
                                </Button>
                            </Col>
                        </Row>
                    }</>
                :
                    <Row>
                        <Col sm={12}>
                            <Alert variant='info'>
                                <Alert.Heading style={{fontSize: '2rem'}}>Downgrade Plan</Alert.Heading>
                                <p style={{fontSize: '1.6rem'}}>Your plan will be downgraded starting next billing cycle.</p>
                            </Alert>
                        </Col>
                        <Col sm={5}><span style={{fontSize: '1.5rem'}}>Selected Plan:</span></Col>
                        <Col sm={7}><h4>{props.scheduled_plan.description}</h4></Col>
                        <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Data Allowance:</span></Col>
                        <Col sm={7}><h4>{(props.scheduled_plan.data_limit_mb/1000)} gb</h4></Col>
                        <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Price:</span></Col>
                        <Col sm={7}>
                            <h4>
                                C$ {parseFloat(props.scheduled_plan.base_price/100).toFixed(2)} + Tax({props.scheduled_plan.tax_rate}%)
                            </h4>
                        </Col>
                        <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                            <Button
                                style={{width: '100%', fontSize: '1.8rem'}}
                                variant="outline-primary"
                                onClick={handleCancelChangePlan}
                            >
                                Cancel Downgrade
                            </Button>
                        </Col>
                    </Row>
                }
            </div>
        </div>
    );
}

export default ChangePlan;