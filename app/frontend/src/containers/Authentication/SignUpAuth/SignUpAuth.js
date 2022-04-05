import React, { useState } from "react";

import { CircularProgress, Grid, FormControl } from '@mui/material';

import Button from '../../../components/Button'
import Checkbox from '../../../components/Checkbox';

import { ErrorMsg, FormBtn, FormContainer, FormInput } from '../StyledForm';

import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import { Link, useHistory } from "react-router-dom";
import { useGlobalContext } from "../../../context-provider";
import { useUsers } from "../../../api/Users";

const SignUpAuth = () => {
    const history = useHistory();
    const context = useGlobalContext();
    const users = useUsers();

    const [loading, setLoading] = useState(false)
    const [confirmPass, setConfirmPass] = useState(false)
    const [error, setError] = useState({
        name: false,
        email: false,
        password: false,
        confirm_password: false
    })
    const [signUp, setSignUp] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const onChangeName = (e) => {
        setSignUp({ ...signUp, name: e.target.value })
    }

    const onChangeEmail = (e) => {
        setSignUp({ ...signUp, email: e.target.value })
    }

    const onChangePassword = (e) => {
        setSignUp({ ...signUp, password: e.target.value })
    }

    const onChangeConfirmPassword = (e) => {
        setSignUp({ ...signUp, confirm_password: e.target.value })
    }

    // TODO - William: should not allow users to signup if the two password fields do not match
    const handleSignUp = (e) => {
        e.preventDefault();

        var missing_signup = Object.keys(signUp).filter(key => signUp[key] === "");

        if (missing_signup.length !== 0) {
            var err_tmp = {
                name: false,
                email: false,
                password: false,
                confirm_password: false
            }
            for (var i = 0; i < missing_signup.length; i++) {
                err_tmp[missing_signup[i]] = true
            }
            setError(err_tmp)
        } 

        else {

            if (signUp.password !== signUp.confirm_password) {
                setConfirmPass(true)
            } 
            
            else {
                setConfirmPass(false)
                
                setLoading(true);
                const signupParams = {
                    name: signUp.name,
                    email: signUp.email,
                    password: signUp.password,
                }; 

                users.signup(signupParams)
                    .then((res) => {
                        if (res.status == 201) {
                            const loginPayload = {
                                username: signUp.email, 
                                password: signUp.password,
                            };
                            let loginParams = new URLSearchParams(loginPayload)

                            users.login(loginParams)
                                .then((response) => { 
                                    console.log(`response was ${response}`)
                                    context.setupUser(response)
                                    setLoading(false)
                                    history.push("/");
                                    // force re-render of homepage
                                    context.loadCurrentUser();
                                })
                                .catch((error) => {
                                    setLoading(false);
                                    console.log(error);
                                });
                        }

                    })
                    .catch((err) => {
                        alert(err.detail)
                        setLoading(false);
                        setSignUp({ ...signUp, password: "" })
                        setSignUp({ ...signUp, confirm_password: "" })
                    });
            }
            }
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            <FormInput>
                <Col>
                    <Form.Label>Name</Form.Label>
                    <Form.Control size="lg" type="name" placeholder="Enter name" onChange={onChangeName} />
                    {error.name ? <ErrorMsg>Enter your name</ErrorMsg> : ""}
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Email</Form.Label>
                    <Form.Control size="lg" type="email" placeholder="Enter email" onChange={onChangeEmail} />
                    {error.email ? <ErrorMsg>Enter your email</ErrorMsg> : ""}
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Password" onChange={onChangePassword} />
                    {error.password ? <ErrorMsg>Enter your password</ErrorMsg> : ""}
                </Col>
                <Col>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Confirm" onChange={onChangeConfirmPassword} />
                    {error.confirm_password && !error.password ? <ErrorMsg>Confirm your password</ErrorMsg> : ""}
                    {confirmPass ? <ErrorMsg>Your password and confirmation password must match</ErrorMsg> : ""}
                </Col>
            </FormInput>

            <FormBtn>
                <Col md={{ span: 6, offset: 3 }}>
                    <Button fill onClick={handleSignUp}>{loading ? <CircularProgress size={15} /> : "Sign Up"}</Button>
                </Col>
            </FormBtn>

            <Row>
                <Col style={{ textAlign: "center" }}>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default SignUpAuth;