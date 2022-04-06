// Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const OrderSummary = () => {
    return (
        <>
            <Card.Header>
                <Card.Title>
                    <h3 style={{textAlign:'center', fontSize:'2rem'}}>Order Summary</h3>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col >
                        <h4>Basic Plan - 100gb</h4>
                    </Col>
                    <Col style={{display:'flex', justifyContent:'flex-end'}}>
                        <h4>C $ 100.00</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>Tax - 13% HST</h4>
                    </Col>
                    <Col style={{display:'flex', justifyContent:'flex-end'}}>
                        <h4>C $ 13.00</h4>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer>
                <Row>
                    <Col>
                        <h3>Total</h3>
                    </Col>
                    <Col>
                        <h3 style={{display:'flex', justifyContent:'flex-end'}}>C $ 113.00</h3>
                    </Col>
                </Row>
            </Card.Footer>
        </>
    )
}

export default OrderSummary;