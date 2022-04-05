import React, { useEffect, useState } from "react";
import { useMutation } from 'react-query'

import Form from "../../components/NewForm/Form";
import { Switch, FormControlLabel, FormGroup, Grid, Link, Alert } from '@mui/material';

import { Redirect, useHistory } from "react-router-dom";
import { useGlobalContext } from "../../context-provider";
import { useUsers } from "../../api/Users"

import * as yup from "yup";


const LogInForm = () => {
    /**
     * A SignIn/LogIn Form with validation
     */
    const history = useHistory();
    const context = useGlobalContext();
    const users = useUsers()
    const [invalid, setInvalid] = useState(false);

    // validation object for form validation
    const schema = yup.object({
        email: yup.string().email().required('No email provided'),
        password: yup.string()
            .required('No password provided.')
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    })

    // mutation function used to update auth serverstate
    const sendLogin = (login) => {
        let payload = new URLSearchParams(login)
        return users.login(payload)
    }

    const { status, data, error, isLoading, mutate } = useMutation(sendLogin)

    // Form handling for calling mutation function
    const loginFormHandler = (data) => {
        data['username'] = data['email']
        delete data['email']
        mutate(data)
    }

    // life cycle hook for monitoring mutation status, and setting up auth context
    useEffect(() => {
        if (status === "success") {
            console.log(data)
            setInvalid(false)
            context.setupUser(data.data)
            context.loadCurrentUser()
            history.push('/')
        }

        if (status === "error") {
            if (error?.response?.status === 401) {
                setInvalid(true)
            }
        }
    }, [status])


    return (
        <Form
            schema={schema}
            onSubmit={loginFormHandler}
            name={"Login"}
            btnlabel={"Sign In"}
        >
            {invalid? <Grid container justifyContent={"center"}>
                <Alert severity="error" variant="outlined">Invalid credentials!</Alert>
            </Grid>:
            null}
            <Grid container direction={"row"} justifyContent={"center"}>
                <Grid item p={1} xs={6} container justifyContent={"flex-start"} alignItems={"center"}>
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label="Remember Me" />
                    </FormGroup>
                </Grid>
                <Grid item p={1} xs={6} container justifyContent={"flex-end"} alignItems={"center"}>
                    <FormGroup>
                        <FormControlLabel control={ <Link href="/404">Forgot Password</Link>} />
                    </FormGroup>
                </Grid>
            </Grid>
        </Form>
    );
}

export default LogInForm;