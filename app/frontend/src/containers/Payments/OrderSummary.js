// Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const OrderSummary = (props) => {
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
                        <h4>{props.plan.description}</h4>
                    </Col>
                    <Col style={{display:'flex', justifyContent:'flex-end'}}>
                        <h4>C$ {parseFloat(props.plan.base_price/100).toFixed(2)}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>Tax - {props.plan.tax_rate}% HST</h4>
                    </Col>
                    <Col style={{display:'flex', justifyContent:'flex-end'}}>
                        <h4>C$ {parseFloat(props.plan.tax_amount/100).toFixed(2)}</h4>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer>
                <Row>
                    <Col>
                        <h3>Total</h3>
                    </Col>
                    <Col>
                        <h3 style={{display:'flex', justifyContent:'flex-end'}}>C$ {parseFloat(props.plan.total_price/100).toFixed(2)}</h3>
                    </Col>
                </Row>
            </Card.Footer>
        </>
    )
}

export default OrderSummary;