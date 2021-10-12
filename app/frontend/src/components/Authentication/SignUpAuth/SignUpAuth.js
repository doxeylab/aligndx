// React
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
// Components
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from '../../Button';
import { CircularProgress } from '@material-ui/core';
// Actions
import { loginRequest, signupRequest } from "../../../http-common";
import { useGlobalContext } from "../../../context-provider";
// styles
import { FormContainer, FormInput, FormBtn } from '../StyledForm';
import '../CustomForm.css';
// Assets
import GoogleIcon from "../../../assets/AuthenticationIcons/google-icon.png";
import FacebookIcon from "../../../assets/AuthenticationIcons/facebook-icon.png";

const SignUpAuth = () => {
    const history = useHistory();
    const context = useGlobalContext();
    const [loading, setLoading] = useState(false)
    const [signUp, setSignUp] = useState({
        name: "",
        email: "",
        password: ""
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

    // TODO - William: should not allow users to signup if the two password fields do not match
    const handleSignUp = (e) => {
        setLoading(true);
        e.preventDefault();

        if (Object.values(signUp).some(o => o === "")) {
            console.log("MISSING PARAMETER")
        }

        const signupParams = {
            name: signUp.name,
            email: signUp.email,
            password: signUp.password,
        };

        signupRequest(signupParams)
            .then((res) => {
                if (res.status == 201) {
                    const loginParams = {
                        username: signUp.email,
                        password: signUp.password,
                    };

                    loginRequest(loginParams)
                        .then((response) => {
                            localStorage.setItem("accessToken", response.access_token);
                            setLoading(false)
                            history.push("/");
                            context.loadCurrentUser();
                        })
                        .catch((error) => {
                            setLoading(false);
                            console.log(error);
                        });
                }

            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                // TODO - William: should display these errors on the UI so users know why they cannot signup
            });
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            <FormInput>
                <Col>
                    <Form.Label>Name</Form.Label>
                    <Form.Control size="lg" type="name" placeholder="Enter name" onChange={onChangeName} />
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Email</Form.Label>
                    <Form.Control size="lg" type="email" placeholder="Enter email" onChange={onChangeEmail} />
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Password" onChange={onChangePassword} />
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Confirm" />
                </Col>
            </FormInput>


            <FormBtn>
                <Col md={{ span: 6, offset: 3 }}>
                    <Button fill onClick={handleSignUp}>{loading ? <CircularProgress size={25} /> : "Sign Up"}</Button>
                </Col>
            </FormBtn>

            <Row>
                <Col style={{ textAlign: "center" }}>
                    <p>Already have an account? <a href="/login">Login</a></p>
                </Col>
            </Row>

            <Row>
                <Col style={{ textAlign: "center" }}>
                    <p>Or connect with</p>
                </Col>
            </Row>
            <Row>
                <Col style={{ display: 'flex', justifyContent: "center" }}>
                    <img src={GoogleIcon} alt='google-icon' width="25" height="25" style={{ margin: "10px" }} />
                    <img src={FacebookIcon} alt='facebook-icon' width="25" height="25" style={{ margin: "10px" }} />
                </Col>
            </Row>
        </FormContainer>
    )
}

export default SignUpAuth;