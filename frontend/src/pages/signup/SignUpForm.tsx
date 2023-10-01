import React, { useState } from "react";

import { Form, FormTextField } from "../../components/Form";
import { FormContainer } from "../../components/Form/StyledForm";
import { FormControlLabel, FormGroup, Grid, Link, Alert, CircularProgress, Typography, InputAdornment, IconButton, Stack, Button } from "@mui/material";

import * as yup from "yup";
import { useAuthContext } from "../../context/AuthProvider";
import { useRouter } from "next/router";

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useBoolean } from '../../hooks/useBoolean'


const SignUpForm = () => {
    /**
     * A SignUp/Register Form with validation
     */
    const router = useRouter();

    const { signUp, login, loading } = useAuthContext();
    const [invalid, setInvalid] = useState(false);
    const showPassword = useBoolean(false)

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
                <Stack direction={'column'} spacing={4} >

                    <Typography variant="h4">Sign Up</Typography>
                    {!!invalid && (
                        <Alert
                            severity="error"
                            variant="outlined"
                            sx={{ mb: 4 }}
                        >
                            Invalid credentials!
                        </Alert>
                    )}
                    <Stack direction={'row'} spacing={4}>
                        <FormTextField
                            name={"name"}
                            label={"Name"}
                            type={"name"}
                            autoComplete={"name"}
                            fullWidth
                        />
                        <FormTextField
                            name={"email"}
                            label={"Email"}
                            type={"email"}
                            autoComplete={"email"}
                            fullWidth />
                    </Stack>

                    <FormTextField
                        name={"password"}
                        label={"Password"}
                        type={showPassword.value ? 'text' : 'password'}
                        autoComplete={"new-password"}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={showPassword.onToggle}
                                        edge="end"
                                    >
                                        {showPassword.value ? (
                                            <VisibilityIcon />
                                        ) : (
                                            <VisibilityOffIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormTextField
                        name={"confirmpassword"}
                        label={"Confirm Password"}
                        type={showPassword.value ? 'text' : 'password'}
                        autoComplete={"new-password"}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={showPassword.onToggle}
                                        edge="end"
                                    >
                                        {showPassword.value ? (
                                            <VisibilityIcon />
                                        ) : (
                                            <VisibilityOffIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Grid container direction={"row"} justifyContent={"center"} padding={2}>
                        <FormGroup>
                            <FormControlLabel label={''} control={<Link href="/signin"> Already have an account? Login</Link>} />
                        </FormGroup>
                    </Grid>
                    <Grid container direction={'row'} justifyContent={'center'}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ width: '30%' }}
                        >
                            {loading ? (
                                <CircularProgress size={25} />
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </Grid>
                </Stack>

            </FormContainer>
        </Form>
    );
}

export default SignUpForm;