import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'

const CurrentPlan = () => {
    return (
        <div className='custom-card'>
            <div className='header'>
                <Row>
                    <Col>
                        <h2>Current Plan</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
                <Row>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Current Plan:</span></Col>
                    <Col sm={7}><h4>Premium Plan - Monthly <Badge variant="success">Active</Badge></h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Next Billing Date:</span></Col>
                    <Col sm={7}><h4>24 May, 2022 <Badge variant="success">Auto Renew</Badge></h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Price:</span></Col>
                    <Col sm={7}><h4>C$ 250 + HST</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Data Allowance:</span></Col>
                    <Col sm={7}><h4>100 gb</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Data Remaining:</span></Col>
                    <Col sm={7}><h4>75 gb</h4></Col>
                </Row>
            </div>
        </div>
    );
}

export default CurrentPlan;