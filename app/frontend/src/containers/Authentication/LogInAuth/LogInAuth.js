import React, { useState } from "react";
import { useQuery} from 'react-query'

import { CircularProgress, Grid} from '@mui/material';

import Button from '../../../components/Button'
import Checkbox from '../../../components/Checkbox';

import { ErrorMsg, FormBtn, FormContainer, FormInput } from '../StyledForm';

import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import { Link, Redirect, useHistory } from "react-router-dom";
import { useGlobalContext } from "../../../context-provider";
import { useUsers } from "../../../api/Users"

import * as yup from "yup";


const LogInAuth = (props) => {
    const history = useHistory();
    const context = useGlobalContext();
    const users = useUsers()

    const [login, setLogin] = useState({
        email: "",
        password: ""
    })
    const [invalid, setInvalid] = useState(true);
    
    const handleLogin = () => {
        const emailformat =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if ( login.password === "" ||login.email === "" || !login.email.match(emailformat)) {
            setInvalid(true)
        }
        else {
            setInvalid(false)
        }
    }
 
    const onChangeEmail = (e) => {
        setLogin({ ...login, email: e.target.value })
        handleLogin()
    }

    const onChangePassword = (e) => {
        setLogin({ ...login, password: e.target.value })
        handleLogin()

    }

    const loginPayload = {
        username: login.email,
        password: login.password,
    }
 
    const loginParams = new URLSearchParams(loginPayload)
    
    const {status, data, error, refetch, isLoading} = useQuery(["user_auth", loginParams], () => users.login(loginParams), {
        enabled: false,
        refetchOnWindowFocus: false,
        retry: false,
        retryOnMount: false 
    })

    if (status === "success") {
        context.setupUser(data.data)
        context.loadCurrentUser()
        return <Redirect push to="/" />
    }

    if (status === "error"){
        console.log(error)
    }

    // const schema = yup.object({
    //     email: yup.string().email().required('No email provided'),
    //     password: yup.string()
    //         .required('No password provided.')
    //         .min(8, 'Password is too short - should be 8 chars minimum.')
    //         .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    // })

    return (
        <FormContainer>
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