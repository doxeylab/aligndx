// React
import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
// Components
import {Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from '../../Button';
import { CircularProgress } from '@material-ui/core';
// Actions
import { request } from "../../../http-common";
// styles
import { FormInput, FormBtn} from '../StyledForm';
import '../CustomForm.css';

const SignUpAuth = () => {
    const history = useHistory();

    const [loading, setLoading] = useState(false)
    const [signUp, setSignUp] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    })

    const onChangeEmail = (e) => {
        setSignUp({...signUp, email: e.target.value})
    }

    const onChangePassword = (e) => {
        setSignUp({...signUp, password: e.target.value})
    }

    const onChangeName = (e) => {
        setSignUp({...signUp, name: e.target.value})
    }


    const onChangeUsername = (e) => {
        setSignUp({...signUp, username: e.target.value})
    }

    const signup = (signupRequest) => {
        return request({
            url: "http://localhost:8080/create_user",
            method: "POST",
            body: JSON.stringify(signupRequest),
        }, "application/json");
    }

    const handleSignUp = (e) => {
        setLoading(true);
        e.preventDefault();

        if (Object.values(signUp).some(o => o === "")) {
            console.log("MISSING PARAMETER")
        }

        const signupRequest = {
            name: signUp.name,
            username: signUp.username,
            email: signUp.email,
            password: signUp.password,
        };

        signup(signupRequest)
            .then(() => {
                setLoading(false);
                history.push('/');
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    return (
        <Form className="form">
            <h1>Sign Up</h1>
            <FormInput>
                <Row className="form-input">
                    <Col>
                        <Form.Label>Username</Form.Label>
                        <Form.Control size="lg" type="username" placeholder="Enter username" onChange={onChangeUsername}/>
                    </Col>
                </Row>
                <Row className="form-input">
                    <Col>
                        <Form.Label>Name</Form.Label>
                        <Form.Control size="lg" type="name" placeholder="Enter name" onChange={onChangeName}/>
                    </Col>
                </Row>
                <Row className="form-input">
                    <Col>
                        <Form.Label>Email</Form.Label>
                        <Form.Control size="lg" type="email" placeholder="Enter email" onChange={onChangeEmail}/>
                    </Col>
                </Row>
                <Row className="form-input">
                    <Col>
                        <Form.Label>Password</Form.Label>
                        <Form.Control size="lg" type="password" placeholder="Password" onChange={onChangePassword}/>
                    </Col>
                </Row>
            </FormInput>

            <FormBtn>
                <Col md={{ span: 6, offset: 3 }}>
                    <Button fill onClick={handleSignUp}>{loading ? <CircularProgress size={25}/> : "Sign Up"}</Button>
                </Col>
            </FormBtn>

            <Row>
                <Col style={{textAlign: "center"}}>
                    <p>Already have an account? <a href="/login">Login</a></p>
                </Col>
            </Row>

            <Row>
                <Col style={{textAlign: "center"}}>
                    <p>Or connect with</p>
                </Col>
            </Row>
        </Form>
    )
}

export default SignUpAuth;