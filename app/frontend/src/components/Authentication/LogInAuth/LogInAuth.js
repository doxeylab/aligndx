//React
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// Components
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import { CircularProgress } from '@material-ui/core';
// Actions
import { request } from "../../../http-common";
import { useGlobalContext } from "../../../context-provider";
// Styles
import { FormContainer, FormInput, FormBtn } from '../StyledForm';
import '../CustomForm.css';
// Assets
import GoogleIcon from "../../../assets/AuthenticationIcons/google-icon.png";
import FacebookIcon from "../../../assets/AuthenticationIcons/facebook-icon.png";

const LogInAuth = () => {
    const history = useHistory();
    const context = useGlobalContext();

    const [loading, setLoading] = useState(false)
    const [login, setLogin] = useState({
        username: "",
        password: ""
    })

    const onChangeUsername = (e) => {
        setLogin({...login, username: e.target.value})
    }

    const onChangePassword = (e) => {
        setLogin({...login, password: e.target.value})
    }

    const loginRequest = (req) => {
        return request({
            url: "http://localhost:8080/token",
            method: "POST",
            body: new URLSearchParams(req),
        }, "application/x-www-form-urlencoded");
    }

    const handleLogin = (e) => {
        setLoading(true);
        e.preventDefault();

        if (Object.values(login).some(o => o === "")) {
            console.log("MISSING PARAMETER")
        }

        const request = {
            username: login.username,
            password: login.password,
        };

        loginRequest(request)
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

    return (
        <FormContainer>
            <h1>Log In</h1>
            <FormInput>
                <Col>
                    <Form.Label>Email</Form.Label>
                    <Form.Control size="lg" type="email" placeholder="Email" onChange={onChangeUsername}/>
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Password" onChange={onChangePassword}/>
                </Col>
            </FormInput>

            <Row>
                <Col>
                    <Checkbox label="Remember me"/>
                </Col>
                <Col style={{cursor: "pointer"}}>
                    <a className="float-right">Forgot Password?</a>
                </Col>
            </Row>

            <FormBtn>
                <Col md={{ span: 6, offset: 3 }}>
                    <Button fill onClick={handleLogin}>{loading ? <CircularProgress size={25} /> : "Login"}</Button>
                </Col>
            </FormBtn>

            <Row>
                <Col style={{textAlign: "center"}}>
                    <p>Don't Have an Account? <a href="/signup">Sign Up</a></p>
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
    );
}

export default LogInAuth;