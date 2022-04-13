import React, { useEffect, useState } from "react";
import { useMutation } from 'react-query'

import { Form, TextField } from "../../components/Form";
import { FormControlLabel, FormGroup, Grid, Link, Alert } from '@mui/material';

import { useHistory } from "react-router-dom";
import { useGlobalContext } from "../../context-provider";
import { useUsers } from "../../api/Users"

import * as yup from "yup";


const SignUpForm = () => {
    /**
     * A SignUp/Register Form with validation
     */
    const history = useHistory();
    const context = useGlobalContext();
    const users = useUsers()
    const [invalid, setInvalid] = useState(false);

    // validation object for form validation
    const schema = yup.object({
        name: yup
            .string()
            .required("No name provided")
            .min(5, 'Username is too short - should be 5 chars minimum')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
        email: yup
            .string()
            .email()
            .required('No email provided'),
        password: yup
            .string()
            .required('No password provided.')
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
        confirmpassword: yup
            .string()
            .required('No password provided.')
            .oneOf([yup.ref('password'), null], "Passwords must match")
    })

    // mutation functions used to update auth serverstate
    // for signup
    const sendSignUp = (signup) => {
        return users.signup(signup)
    }

    // for auth
    const sendLogin = (login) => {
        let payload = new URLSearchParams(login)
        return users.login(payload)
    }

    const login = useMutation(sendLogin, {
        onSuccess:(data) => {
            setInvalid(false)
            context.setupUser(data.data)
            context.loadCurrentUser()
            history.push('/')
        },
        onError:(error) => {
            if (error?.response?.status === 401) {
                setInvalid(true)
            } 
        }
    })
 
    const signUp = useMutation(sendSignUp, {
        onSuccess:(data, variables, context) => {
            setInvalid(false)
            let loginpayload = {
                "username": variables.email,
                "password": variables.password
            }
            login.mutate(loginpayload)
        },
        onError:(error) => {
            console.log(error)
        }
    })

    // Form handling for calling mutation function
    const signupFormHandler = (data) => {
        signUp.mutate(data)
    } 

    // const passwordhint="Rules: 8-25 characters, with minimum 5 characters, 1 upper case, 1 lower case, 1 number and 1 special case"

    return (
        <Form
            schema={schema}
            onSubmit={signupFormHandler}
            name={"Sign Up"}
            btnlabel={"Register"}
            loading={signUp.isLoading}
        >
            <Grid container direction={"row"} justifyContent={"center"} columnSpacing={2}>
                <Grid item xs={6} container justifyContent={"flex-start"} alignItems={"center"}>
                    <TextField name={"name"} label={"name"} type={"name"} />

                </Grid>
                <Grid item xs={6} container justifyContent={"flex-end"} alignItems={"center"}>
                    <TextField name={"email"} label={"email"} type={"email"} autoComplete={"email"} />
                </Grid>
            </Grid>
            <TextField name={"password"} label={"password"} type={"password"} autoComplete={"new-password"}/>
            <TextField name={"confirmpassword"} label={"confirm password"} type={"password"} autoComplete={"new-password"} />

            {invalid ? <Grid container justifyContent={"center"}>
                <Alert severity="error" variant="outlined">Invalid credentials!</Alert>
            </Grid> :
                null}
            <Grid container direction={"row"} justifyContent={"center"} padding={2}>
                <FormGroup>
                    <FormControlLabel control={<Link href="/login"> Already have an account? Login</Link>} />
                </FormGroup>
            </Grid>
        </Form>
    );
}

export default SignUpForm;