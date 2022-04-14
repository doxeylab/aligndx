import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from "react-bootstrap/Button"

const PaymentMethod = () => {
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
                <Row>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Current Payment Method:</span></Col>
                    <Col sm={7}><h4>Visa</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Card Number:</span></Col>
                    <Col sm={7}><h4>•••• •••• •••• 4242</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Expiry:</span></Col>
                    <Col sm={7}><h4>Exp: 02/25</h4></Col>
                    <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                        <Button style={{width: '100%', fontSize: '1.8rem'}} variant="outline-primary">Update Card</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default PaymentMethod;