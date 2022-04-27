import React, { useEffect, useState } from "react";
import { useMutation } from 'react-query'

import { Form, FormTextField } from "../../components/Form";
import { Switch, FormControlLabel, FormGroup, Grid, Link, Alert } from '@mui/material';

import { useHistory } from "react-router-dom";
import { useUsers } from "../../api/Users"

import * as yup from "yup";
import { useAuthContext } from "../../context/AuthProvider";


const LogInForm = (props) => {
    /**
     * A SignIn/LogIn Form with validation
     */
    const history = useHistory();
    const context = useAuthContext();
    const users = useUsers()
    const [invalid, setInvalid] = useState(false);
    const [checked, setChecked] = useState(true);

    // validation object for form validation
    const schema = yup.object({
        email: yup
            .string()
            .email()
            .required('No email provided'),
        password: yup
            .string()
            .required('No password provided. Rules: 8-25 characters, with minimum 5 characters, 1 upper case, 1 lower case, 1 number and 1 special case')
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .max(25, 'Exceeded password length limit')
            .matches(/^(?=.{5,})/, "Must Contain 5 Characters")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])/,
                "Must Contain One Uppercase, One Lowercase"
            )
            .matches(
                /^(?=.*[!@#\$%\^&\*])/,
                "Must Contain One Special Case Character"
            )
            .matches(/^(?=.{6,20}$)\D*\d/, "Must Contain One Number"),
    })

    // mutation function used to update auth serverstate
    const sendLogin = (login) => {
        let payload = new URLSearchParams(login)
        return users.login(payload)
    }

    const login = useMutation(sendLogin, {
        onSuccess: (data) => {
            setInvalid(false)
            context.setupUser(data.data)
            context.loadCurrentUser()
            history.push(props.link)
        },
        onError: (error) => {
            if (error?.response?.status === 401) {
                setInvalid(true)
            }
        }
    })

    // Form handling for calling mutation function
    const loginFormHandler = (data) => {
        data['username'] = data['email']
        delete data['email']
        login.mutate(data)
    }

    const switchHandler = (event) => {
        setChecked(event.target.checked)
    }

    return (
        <Form
            schema={schema}
            onSubmit={loginFormHandler}
            name={"Login"}
            btnlabel={"Sign In"}
            loading={login.isLoading}
        >
            <FormTextField name={"email"} label={"email"} type={"email"} autoComplete={"email"} />
            <FormTextField name={"password"} label={"password"} type={"password"} autoComplete={"new-password"} />

            {invalid ? <Grid container justifyContent={"center"}>
                <Alert severity="error" variant="outlined">Invalid credentials!</Alert>
            </Grid> :
                null}
            <Grid container direction={"row"} justifyContent={"center"}>
                <Grid item  xs container justifyContent={"flex-start"} alignItems={"center"}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={checked} onChange={switchHandler} />} label="Remember Me" />
                    </FormGroup>
                </Grid>
                <Grid item xs container justifyContent={"flex-end"} alignItems={"center"}>
                        <Link href="/404">Forgot Password</Link>
                </Grid>
            </Grid>
        </Form>
    );
}

export default LogInForm;