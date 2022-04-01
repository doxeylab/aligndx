import React, { useState } from "react";
import { useQueryClient, useQuery} from 'react-query'

import { CircularProgress, Grid} from '@mui/material';

import Button from '../../../components/Button'
import Checkbox from '../../../components/Checkbox';

import { ErrorMsg, FormBtn, FormContainer, FormInput } from '../StyledForm';

import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import { Link, useHistory } from "react-router-dom";
import { useGlobalContext } from "../../../context-provider";
import { Users } from "../../../services/api/Users"

const LogInAuth = (props) => {
    const history = useHistory();
    const context = useGlobalContext();

    const [login, setLogin] = useState({
        email: "",
        password: ""
    })
    const [invalid, setInvalid] = useState(true);
 
    const onChangeEmail = (e) => {
        setLogin({ ...login, email: e.target.value })
    }

    const onChangePassword = (e) => {
        setLogin({ ...login, password: e.target.value })
    }

    const loginPayload = {
        username: login.email,
        password: login.password,
    }

    const loginParams = new URLSearchParams(loginPayload)
    
    const {status, data, error, refetch, isLoading} = useQuery("user_data", Users.login(
        loginParams
    ), {
        enabled: false
    })

    if (status === "success") {
        console.log("TESTINGNG")
        context.setupUser(data)
        history.push("/")
        context.loadCurrentUser();
    }

    if (status === "error"){
        console.log(error)
    }
    
    const handleLogin = () => {
        const emailformat =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if ( login.password === "" ||login.email === "" || !login.email.match(emailformat)) {
            setInvalid(true)
        }
        else {
            setInvalid(false)
        }
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
                    <Button fill disabled={invalid} onClick={refetch}>{isLoading ? <CircularProgress size={25} /> : "Login"}</Button>
                </Col>
            </FormBtn>
        </FormContainer>
    );
}

export default LogInAuth;