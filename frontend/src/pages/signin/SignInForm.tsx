import React, { useState } from "react";
import { Form, FormTextField } from "../../components/Form";
import { Switch, FormControlLabel, FormGroup, Grid, Link, Alert } from '@mui/material';
import * as yup from "yup";
import { useAuthContext } from "../../context/AuthProvider";
import { useRouter } from "next/router";
import { FormContainer, StyledButton } from "../../components/Form/StyledForm";
import { CircularProgress, Typography } from "@mui/material";

const SignInForm = () => {
    /**
     * A SignIn/LogIn Form with validation
     */

    const router = useRouter();
    const { login, loading } = useAuthContext();
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
 
    const switchHandler = (event: any) => {
        setChecked(event.target.checked)
    }

    const loginFormHandler = (async (data: any) => {
        try {
            data['username'] = data['email']
            delete data['email']
            await login?.(data);
            setInvalid(false)
            router.push('/')
        } catch (error) {
            console.error(error);
            setInvalid(true)
        }
    });

    return (
        <Form
            schema={schema}
            onSubmit={loginFormHandler}
        >
            <FormContainer>
                <Typography variant="h4">Sign In</Typography>
                <FormTextField
                    name={"email"}
                    label={"Email"}
                    type={"email"}
                    autoComplete={"email"}

                />
                <FormTextField
                    name={"password"}
                    label={"Password"}
                    type={"password"}
                    autoComplete={"current-password"}
                />

                {invalid ? <Grid container justifyContent={"center"}>
                    <Alert
                        severity="error"
                        variant="outlined">Invalid credentials!</Alert>
                </Grid> :
                    null}
                <Grid container direction={"row"} justifyContent={"center"}>
                    <Grid item xs container justifyContent={"flex-start"} alignItems={"center"}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={checked} onChange={switchHandler} />}
                                label="Remember Me"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs container justifyContent={"flex-end"} alignItems={"center"}>
                        <Link href="/404">Forgot Password</Link>
                    </Grid>
                </Grid>
                <StyledButton
                    size='large'
                    variant="contained"
                    type="submit"
                >
                    {loading ? <CircularProgress size={25} /> : 'Log In'}
                </StyledButton>
            </FormContainer>
        </Form>
    );
}

export default SignInForm;