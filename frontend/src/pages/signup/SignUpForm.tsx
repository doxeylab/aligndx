import React, { useState } from "react";

import { Form, FormTextField } from "../../components/Form";
import { FormContainer, StyledButton } from "../../components/Form/StyledForm";
import { CircularProgress, Typography } from "@mui/material";
import { FormControlLabel, FormGroup, Grid, Link, Alert } from '@mui/material';

import * as yup from "yup";
import { useAuthContext } from "../../context/AuthProvider";
import { useRouter } from "next/router";


const SignUpForm = () => {
    /**
     * A SignUp/Register Form with validation
     */
    const router = useRouter();

    const { signUp, login, loading } = useAuthContext();
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

    const signUpFormHandler = (async (data: any) => {
        try {
            await signUp?.(data)
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
            onSubmit={signUpFormHandler}
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
                    {loading ? <CircularProgress size={25} /> : 'Register'}
                </StyledButton>
            </FormContainer>
        </Form>
    );
}

export default SignUpForm;