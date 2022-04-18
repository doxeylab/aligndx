import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useState } from 'react'

const ManageUsers = (props) => {
    return (
        <div className="custom-card">
            <div className='header'>
                <Row>
                    <Col>
                        <h2>Manage Users</h2>
                    </Col>
                </Row>
            </div>
            <div className='main-content'>
                <div>{props.users[0].name}</div>
            </div>
        </div>
    );
}

export default ManageUsers;