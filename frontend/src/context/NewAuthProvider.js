import { createContext, ReactNode, useState, useContext } from "react";

const AuthContext = createContext({});

interface AuthProviderProps {
    children : ReactNode;
}
export const AuthProvider = (props : AuthProviderProps) => {
    const [auth, setAuth] = useState({
        accessToken: false,
        refreshToken: false,
        user: false,
        role: false,
    })

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
            refreshToken: response.refresh_token,
            user: payload.usr,
            role: payload.rol,
        })
    }

    return (
        <AuthContext.Provider 
            value={{ 
                auth, setAuth, setupUser
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )

} 

export default AuthContext;
export const useAuthContext = () => useContext(AuthContext)
