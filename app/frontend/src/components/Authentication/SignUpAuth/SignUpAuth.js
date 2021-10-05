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
import { FormContainer, FormInput, FormBtn} from '../StyledForm';
import '../CustomForm.css';
// Assets
import GoogleIcon from "../../../assets/AuthenticationIcons/google-icon.png";
import FacebookIcon from "../../../assets/AuthenticationIcons/facebook-icon.png";

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
        <FormContainer>
            <h1>Sign Up</h1>
            <FormInput>
                <Col>
                    <Form.Label>Name</Form.Label>
                    <Form.Control size="lg" type="name" placeholder="Enter name" onChange={onChangeName}/>
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Email</Form.Label>
                    <Form.Control size="lg" type="email" placeholder="Enter email" onChange={onChangeEmail}/>
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Password" onChange={onChangePassword}/>
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Confirm"/>
                </Col>
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
            <Row>
                <Col style={{display: 'flex', justifyContent: "center"}}>
                    <img src={GoogleIcon} alt='google-icon' width="25" height="25" style={{margin: "10px"}}/>
                    <img src={FacebookIcon} alt='facebook-icon' width="25" height="25" style={{margin: "10px"}}/>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default SignUpAuth;