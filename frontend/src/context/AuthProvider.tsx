import { createContext, useContext, FC, ReactNode, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage'
import { NextResponse } from 'next/server'

interface AuthInterface {
    auth: object;
    setAuth: any;
    authenticated: boolean;
    setupUser: (response: any) => boolean | null;
}

interface AuthProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthInterface | null>(null);

export const AuthProvider: FC<AuthProps> = ({ children }) => {
    const [auth, setAuth] = useLocalStorage('auth', {});

    const _decodeToken = (token: string) => {
        try {
            return JSON.parse(atob(token));
        }
        catch {
            return;
        }
    }
    const decodeToken = (token: string) => {
        return token
            .split(".")
            .map(token => _decodeToken(token))
            .reduce((acc, curr) => {
                if (!!curr) acc = { ...acc, ...curr };
                return acc;
            }, Object.create(null));
    }

    const setupUser = (response: any) => {
        const payload = decodeToken(response.access_token)
        setAuth({
            accessToken: response.access_token,
            user: payload.usr,
            role: payload.rol,
        })
        return true;
    }

    const isEmpty = (obj: object) => {
        return Object.keys(obj).length === 0;
    }

    return (
        <AuthContext.Provider
            value={{
                auth: auth,
                authenticated: !isEmpty(auth),
                setAuth: setAuth,
                setupUser: setupUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

export const useAuthContext = () => useContext(AuthContext)
