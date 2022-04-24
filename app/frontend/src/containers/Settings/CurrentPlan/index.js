import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'

const CurrentPlan = (props) => {
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
                    {props.sub && props.plan ? <>
                        <Col sm={5}><span style={{fontSize: '1.5rem'}}>Current Plan:</span></Col>
                        <Col sm={7}>
                            <h4>
                                {props.plan.description}
                                {props.sub.is_active && <Badge className='ml-3' variant="success">Active</Badge>}
                                {props.sub.is_cancelled && <Badge className='ml-3' variant="danger">Cancelled</Badge>}
                            </h4>
                        </Col>
                        {props.sub.is_active && <>
                            <Col sm={5}><span style={{fontSize: '1.5rem'}}>Next Billing Date:</span></Col>
                            <Col sm={7}>
                                <h4>
                                    {props.sub.current_period_end}
                                    {props.sub.auto_renew && <Badge className='ml-3' variant="success">Auto Renew</Badge>}
                                    {!props.sub.auto_renew && <Badge className='ml-3' variant="warning">Auto Renew - Off</Badge>}
                                </h4>
                            </Col>
                        </>}
                        {props.sub.is_cancelled && <>
                            <Col sm={5}><span style={{fontSize: '1.5rem'}}>Cancelled Since:</span></Col>
                            <Col sm={7}>
                                <h4>
                                    {props.sub.cancel_date}
                                </h4>
                            </Col>
                        </>}
                        {props.sub.is_active && <>
                            <Col sm={5}><span style={{fontSize: '1.5rem'}}>Monthly Price:</span></Col>
                            <Col sm={7}><h4>C$ {parseFloat(props.plan.base_price/100).toFixed(2)} + HST</h4></Col>
                            <Col sm={5}><span style={{fontSize: '1.5rem'}}>Data Allowance:</span></Col>
                            <Col sm={7}><h4>{(props.plan.data_limit_mb/1000)} gb</h4></Col>
                            <Col sm={5}><span style={{fontSize: '1.5rem'}}>Data Remaining:</span></Col>
                            <Col sm={7}><h4>75 gb - TODO</h4></Col>
                        </>}
                        </>
                    :
                        <Col>
                            <h3>No subscription found.</h3>
                        </Col>
                    }
                </Row>
            </div>
        </div>
    );
}

export default CurrentPlan;