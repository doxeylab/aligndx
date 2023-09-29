'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FormProvider, FormText } from '@/components/form'
import {
    Switch,
    FormControlLabel,
    FormGroup,
    Grid,
    Link,
    Alert,
    Button,
    Stack,
    InputAdornment,
    IconButton,
} from '@mui/material'
import { useAuthContext } from '@/context/auth-context'
import { useUsers } from '@/api/Users'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSimpleBoolean } from '@/hooks/use-boolean'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const LoginView = () => {
    /**
     * A SignIn/LogIn Form with validation
     */

    const router = useRouter()
    const context = useAuthContext()
    const users = useUsers()
    const [errorMsg, setErrorMsg] = useState('')
    const showPassword = useSimpleBoolean(false)
    const checked = useSimpleBoolean(false)

    // validation object for form validation
    const schema = yup.object({
        email: yup.string().email().required('No email provided'),
        password: yup
            .string()
            .required(
                'No password provided. Rules: 8-25 characters, with minimum 5 characters, 1 upper case, 1 lower case, 1 number and 1 special case'
            )
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .max(25, 'Exceeded password length limit')
            .matches(/^(?=.{5,})/, 'Must Contain 5 Characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])/,
                'Must Contain One Uppercase, One Lowercase'
            )
            .matches(
                /^(?=.*[!@#\$%\^&\*])/,
                'Must Contain One Special Case Character'
            )
            .matches(/^(?=.{6,20}$)\D*\d/, 'Must Contain One Number'),
    })

    const defaultValues = {
        email: '',
        password: '',
    }

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    })

    // mutation function used to update auth serverstate
    const sendLogin = (login: any) => {
        const payload = new URLSearchParams(login)
        return users.login(payload)
    }

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const login = useMutation(sendLogin, {
        onSuccess: (data) => {
            context?.setupUser(data.data)
            router.push('/')
        },
        onError: (error: any) => {
            console.error(error)
            reset()
            setErrorMsg(error?.response?.data?.detail)
        },
    })

    // Form handling for calling mutation function
    const onSubmit = handleSubmit(async (data: any) => {
        data['username'] = data['email']
        delete data['email']
        login.mutate(data)
    })

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            {!!errorMsg && (
                <Grid pb={4}>
                    <Alert severity="error">{errorMsg}</Alert>
                </Grid>
            )}
            <Stack direction={'column'} spacing={4}>
                <FormText
                    name={'email'}
                    label={'Email'}
                    type={'email'}
                    autoComplete={'email'}
                    fullWidth
                />
                <FormText
                    name={'password'}
                    label={'Password'}
                    type={showPassword.value ? 'text' : 'password'}
                    autoComplete={'current-password'}
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
                <Stack
                    direction={'row'}
                    spacing={2}
                    pb={4}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={checked.value}
                                    onChange={checked.onToggle}
                                />
                            }
                            label="Remember Me"
                        />
                    </FormGroup>
                    <Link href="/404">Forgot password</Link>
                </Stack>
            </Stack>

            <Grid container direction={'row'} justifyContent={'center'}>
                <Button
                    size="large"
                    variant="contained"
                    type="submit"
                    sx={{ width: '20%' }}
                >
                    {login.isLoading ? (
                        <CircularProgress size={25} />
                    ) : (
                        'Log In'
                    )}
                </Button>
            </Grid>
        </FormProvider>
    )
}

export default LoginView
