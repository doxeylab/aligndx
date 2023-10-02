import React, { useState } from "react";
import { Form, FormTextField } from "../../components/Form";
import * as yup from "yup";
import { useAuthContext } from "../../context/AuthProvider";
import { useRouter } from "next/router";
import { FormContainer } from "../../components/Form/StyledForm";
import { CircularProgress, Typography, InputAdornment, IconButton, Switch, FormControlLabel, FormGroup, Grid, Link, Stack, Alert, Button } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useBoolean } from '../../hooks/useBoolean'

const SignInForm = () => {
    /**
     * A SignIn/LogIn Form with validation
     */

    const router = useRouter();
    const { login, loading } = useAuthContext();
    const [invalid, setInvalid] = useState(false);
    const showPassword = useBoolean(false)
    const checked = useBoolean(false)

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
                <Stack direction={'column'} spacing={4} >
                    <Typography variant="h4">Sign In</Typography>
                    {!!invalid && (
                        <Alert
                            severity="error"
                            variant="outlined"
                            sx={{ mb: 4 }}
                        >
                            Invalid credentials!
                        </Alert>
                    )}

                    <FormTextField
                        name={"email"}
                        label={"Email"}
                        type={"email"}
                        autoComplete={"email"}
                        fullWidth
                    />
                    <FormTextField
                        name={"password"}
                        label={"Password"}
                        type={showPassword.value ? 'text' : 'password'}
                        autoComplete={"current-password"}
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
                    {/* <Grid container direction={"row"} justifyContent={"center"}>
                    <Grid item xs container justifyContent={"flex-start"} alignItems={"center"}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={checked.value} onChange={checked.onToggle} />}
                                label="Remember Me"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs container justifyContent={"flex-end"} alignItems={"center"}>
                        <Link href="/404">Forgot Password</Link>
                    </Grid>
                </Grid> */}
                    <Grid container direction={'row'} justifyContent={'center'}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ width: '30%' }}
                        >
                            {loading ? (
                                <CircularProgress size={25} />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </Grid>

                </Stack>
            </FormContainer>

        </Form>
    );
}

export default SignInForm;