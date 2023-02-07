import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query'

import { Form, FormTextField } from "../../components/Form";
import { FormContainer, StyledButton } from "../../components/Form/StyledForm";
import { CircularProgress, Typography } from "@mui/material";
import { FormControlLabel, FormGroup, Grid, Link, Alert } from '@mui/material';
import { useUsers } from "../../api/Users"

import * as yup from "yup";
import { useAuthContext } from "../../context/AuthProvider";
import { useRouter } from "next/router";


const SignUpForm = () => {
    /**
     * A SignUp/Register Form with validation
     */
    const router = useRouter();

    const context = useAuthContext();
    const users = useUsers()
    const [invalid, setInvalid] = useState(false);

    // validation object for form validation
    const schema = yup.object({
        name: yup
            .string()
            .required("No name provided")
            .min(5, 'Minimum 5 characters')
            .matches(/^[aA-zZ\s]+$/, 'Alphabet characters only'),
        email: yup
            .string()
            .email('Must be a valid email')
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
        confirmpassword: yup
            .string()
            .required('No password provided.')
            .oneOf([yup.ref('password'), null], "Passwords must match")
    })

    // mutation functions used to update auth serverstate
    // for signup
    const sendSignUp = (signup: any) => {
        return users.signup(signup)
    }

    // for auth
    const sendLogin = (login: any) => {
        const payload = new URLSearchParams(login)
        return users.login(payload)
    }

    const login = useMutation(sendLogin, {
        onSuccess: (data) => {
            setInvalid(false)
            context?.setupUser(data.data)
            router.push('/')

        },
        onError: (error: any) => {
            if (error?.response?.status === 401) {
                setInvalid(true)
            }
        }
    })

    const signUp = useMutation(sendSignUp, {
        onSuccess: (data, variables, context) => {
            setInvalid(false)
            const loginpayload = {
                "username": variables.email,
                "password": variables.password
            }
            login.mutate(loginpayload)
        },
        onError: (error) => {
            console.log(error)
        }
    })

    // Form handling for calling mutation function
    const signupFormHandler = (data: any) => {
        signUp.mutate(data)
    }

    return (
        <Form
            schema={schema}
            onSubmit={signupFormHandler}
        >
            <FormContainer>
                <Typography variant="h4">Sign Up</Typography>
                <Grid container direction={"row"} justifyContent={"center"} columnSpacing={2}>
                    <Grid item xs={6} container justifyContent={"flex-start"} alignItems={"center"}>
                        <FormTextField
                            name={"name"}
                            label={"Name"}
                            type={"name"}
                        />
                    </Grid>
                    <Grid item xs={6} container justifyContent={"flex-end"} alignItems={"center"}>
                        <FormTextField
                            name={"email"}
                            label={"Email"}
                            type={"email"}
                            autoComplete={"email"} />
                    </Grid>
                </Grid>
                <FormTextField
                    name={"password"}
                    label={"Password"}
                    type={"password"}
                    autoComplete={"new-password"}
                />
                <FormTextField
                    name={"confirmpassword"}
                    label={"Confirm Password"}
                    type={"password"}
                    autoComplete={"new-password"}
                />

                {invalid ? <Grid container justifyContent={"center"}>
                    <Alert severity="error" variant="outlined">Invalid credentials!</Alert>
                </Grid> :
                    null}
                <Grid container direction={"row"} justifyContent={"center"} padding={2}>
                    <FormGroup>
                        <FormControlLabel label={''} control={<Link href="/login"> Already have an account? Login</Link>} />
                    </FormGroup>
                </Grid>
                <StyledButton
                    size='large'
                    variant="contained"
                    type="submit"
                >
                    {signUp.isLoading ? <CircularProgress size={25} /> : 'Register'}
                </StyledButton>
            </FormContainer>
        </Form>
    );
}

export default SignUpForm;