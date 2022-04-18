import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useState } from 'react'

const ChangePlan = (props) => {
    const [plans] = useState(props.plans);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isUpgrade, setIsUpgrade] = useState(true);

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
        }
    }

    return (
        <div className="custom-card">
            <div className='header'>
                <Row>
                    <Col>
                        <h2>Change Plan</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
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
                        <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                            <Button style={{width: '100%', fontSize: '1.8rem'}} variant="outline-primary">Change Plan</Button>
                        </Col>
                    </Row>
                }
            </div>
        </div>
    );
}

export default ChangePlan;