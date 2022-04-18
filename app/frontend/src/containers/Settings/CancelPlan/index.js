import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

const CancelPlan = (props) => {
    return (
        <div className="custom-card">
            <div className='header'>
                <Row>
                    <Col>
                        <h2>Cancel Plan</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
                <Row>
                    {props.sub.auto_renew ?
                        <Col>
                            <Alert variant='info'>
                                <Alert.Heading style={{fontSize: '2rem'}}>Cancellation Request</Alert.Heading>
                                <p style={{fontSize: '1.6rem'}}>You may request to cancel anytime, however the cancellation is 
                                    effective at the end of current billing period.</p>
                            </Alert>
                        </Col>
                    :
                        <Col>
                            <Alert variant='info'>
                                <Alert.Heading style={{fontSize: '2rem'}}>We are sorry to see you go!</Alert.Heading>
                                <p style={{fontSize: '1.6rem'}}>Cancellation is effective at the end of current billing period.
                                    You may continue to use the service until 24th May, 2022.</p>
                                <hr />
                                <p style={{fontSize: '1.6rem'}}>You may undo cancellation request my clicking the undo button below.</p>
                            </Alert>
                        </Col>
                    }
                </Row>
                <Row>
                    {props.sub.auto_renew ?
                        <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                            <Button style={{width: '100%', fontSize: '1.8rem'}} variant="outline-primary">Request Cancellation</Button>
                        </Col>
                    :
                        <Col sm={{ span: 7, offset: 5 }} style={{marginTop:'16px'}}>
                            <Button style={{width: '100%', fontSize: '1.8rem'}} variant="outline-primary">Undo Cancellation</Button>
                        </Col>
                    }
                </Row>
            </div>
        </div>
    );
}

export default CancelPlan;