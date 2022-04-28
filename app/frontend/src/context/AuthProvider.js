import React, { useContext, useEffect, useState } from 'react';

import { useHistory } from "react-router-dom";
import { useUsers } from '../api/Users';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = React.createContext({
    auth: {},
    authenticated: false,
    currentUser: null,
    logout: () => { },
    setupUser: () => { }
});

export const AuthProvider = ({ children }) => {

    const history = useHistory();
    const users = useUsers();
    const [auth, setAuth] = useLocalStorage('auth', {})

    const _decodeToken = (token) => {
        try {
            return JSON.parse(atob(token));
        }
        catch {
            return;
        }
    }
    const decodeToken = (token) => {
        return token
            .split(".")
            .map(token => _decodeToken(token))
            .reduce((acc, curr) => {
                if (!!curr) acc = { ...acc, ...curr };
                return acc;
            }, Object.create(null));
    }

    const logout = () => {
        setAuth({})
        history.push('/login');
    }

    const setupUser = (response) => {
        let payload = decodeToken(response.access_token)
        setAuth({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            user: payload.usr,
            role: payload.rol,
        })
    }

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated: !isEmpty(auth),
                auth: auth,
                currentUser: auth?.user,
                logout: logout,
                setupUser: setupUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

export const useAuthContext = () => useContext(AuthContext)
