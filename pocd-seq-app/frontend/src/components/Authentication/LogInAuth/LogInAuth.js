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
import { FormInput, FormBtn } from '../StyledForm';
import '../CustomForm.css';

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
        <Form className="form">
            <h1>Log In</h1>
            <FormInput>
                <Row className="form-input">
                    <Col>
                        <Form.Label>Username</Form.Label>
                        <Form.Control size="lg" type="username" placeholder="Enter username" onChange={onChangeUsername}/>
                    </Col>
                </Row>
                <Row className="form-input">
                    <Col>
                        <Form.Label>Password</Form.Label>
                        <Form.Control size="lg" type="password" placeholder="Password" onChange={onChangePassword}/>
                    </Col>
                </Row>
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
        </Form>
    );
}

export default LogInAuth;