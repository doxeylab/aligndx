import { CircularProgress } from '@material-ui/core';
import React, { useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useHistory } from "react-router-dom";
import FacebookIcon from "../../../assets/AuthenticationIcons/facebook-icon.png";
import GoogleIcon from "../../../assets/AuthenticationIcons/google-icon.png";
import { useGlobalContext } from "../../../context-provider";
import { loginRequest } from "../../../http-common";
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import { ErrorMsg, FormBtn, FormContainer, FormInput } from '../StyledForm';

const LogInAuth = (props) => {
    const history = useHistory();
    const context = useGlobalContext();

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [login, setLogin] = useState({
        email: "",
        password: ""
    })

    const onChangeEmail = (e) => {
        setLogin({ ...login, email: e.target.value })
    }

    const onChangePassword = (e) => {
        setLogin({ ...login, password: e.target.value })
    }

    const handleLogin = (e) => {
        setLoading(true);
        e.preventDefault();

        if (Object.values(login).some(o => o === "")) {
            console.log("MISSING PARAMETER")
        }

        // username = email in our project
        const loginParams = {
            username: login.email,
            password: login.password,
        };

        loginRequest(loginParams)
            .then((response) => {
                localStorage.setItem("accessToken", response.access_token);
                setLoading(false)
                setError(false)
                context.loadCurrentUser();
                history.push(props.link)
                // force re-render of homepage
                history.go(0);
            })
            .catch((error) => {
                setLoading(false);
                setError(true);
            });
    }

    return (
        <FormContainer>
            <h1>Log In</h1>
            <FormInput>
                <Col>
                    <Form.Label>Email</Form.Label>
                    <Form.Control size="lg" type="email" placeholder="Email" onChange={onChangeEmail} />
                </Col>
            </FormInput>
            <FormInput>
                <Col>
                    <Form.Label>Password</Form.Label>
                    <Form.Control size="lg" type="password" placeholder="Password" onChange={onChangePassword} />
                </Col>
            </FormInput>

            <Row>
                <Col>
                    <Checkbox label="Remember me" />
                </Col>
                <Col style={{ cursor: "pointer" }}>
                    <a className="float-right">Forgot Password?</a>
                </Col>
            </Row>

            {error ?
                <Row>
                    <Col style={{ textAlign: "center" }}>
                        <ErrorMsg>Invalid credentials!</ErrorMsg>
                    </Col>
                </Row>
                :
                ""
            }

            <FormBtn>
                <Col md={{ span: 6, offset: 3 }}>
                    <Button fill onClick={handleLogin}>{loading ? <CircularProgress size={25} /> : "Login"}</Button>
                </Col>
            </FormBtn>

            <Row>
                <Col style={{ textAlign: "center" }}>
                    <p>Don't Have an Account? <Link to="/signup">Sign Up</Link></p>
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
    );
}

export default LogInAuth;