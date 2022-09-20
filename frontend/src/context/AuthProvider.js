import React, { useContext } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = React.createContext({
    auth: {},
    setAuth: () => {},
    authenticated: false,
    currentUser: null,
    setupUser: () => { }
});

export const AuthProvider = ({ children }) => {

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

    const setupUser = (response) => {
        let payload = decodeToken(response.access_token)
        setAuth({
            accessToken: response.access_token,
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
                setAuth: setAuth,
                currentUser: auth?.user, 
                setupUser: setupUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

export const useAuthContext = () => useContext(AuthContext)
