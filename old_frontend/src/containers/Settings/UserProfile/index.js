import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const UserProfile = (props) => {
    return (
        <div className='custom-card'>
            <div className='header'>
                <Row>
                    <Col>
                        <h2>User Profile</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
                <Row>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Name:</span></Col>
                    <Col sm={7}><h4>{props.user.name}</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Email:</span></Col>
                    <Col sm={7}><h4>{props.user.email}</h4></Col>
                    <Col sm={5}><span style={{fontSize: '1.5rem'}}>Type:</span></Col>
                    <Col sm={7}><h4>{props.user.is_admin ? 'Admin' : 'Non-Admin'}</h4></Col>
                </Row>
            </div>
        </div>
    );
}

export default UserProfile;