import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const ChangePlan = () => {
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
                        >
                            <option key={''} value={''}>--- Select a Plan ---</option>
                            <option key={'plan-1'} value={'plan-1'}>Standard Plan</option>
                        </Form.Control>
                    </Col>
                </Row>
                <Row style={{marginTop:'16px'}}>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Data Allowance:</span></Col>
                    <Col sm={7}><h4>250 gb</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Price:</span></Col>
                    <Col sm={7}><h4>$100 + HST</h4></Col>
                    <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                        <Button style={{width: '100%', fontSize: '1.8rem'}} variant="outline-primary">Update Plan</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ChangePlan;