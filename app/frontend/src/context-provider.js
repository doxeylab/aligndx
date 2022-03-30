import React, {useContext, useLayoutEffect, useState} from 'react';
import {getCurrentUser} from "./http-common";
import {useHistory} from "react-router-dom";

const GlobalContext = React.createContext({
    authenticated: false,
    currentUser: null,
    logout: () => {},
    setupUser: () => {},
    loadCurrentUser: () => {}
});

const GlobalContextProvider = (props) => {

    // Hack to initialize user before render
    let initialAuth = false
    let initialUser = null

    try {
        const token = localStorage.getItem("accessToken")
        const usermeta = JSON.parse(localStorage.getItem("userMeta"))
        if (token) {
            initialAuth = true  
            initialUser = usermeta
        }
    }
    catch (error) {
        // do nothing
    }
    
    const history = useHistory();
    const [authenticated, setAuthenticated] = useState(initialAuth);
    const [currentUser, setCurrentUser] = useState(initialUser);

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
            if (!!curr) acc = { ...acc, ...curr};
            return acc;
        }, Object.create(null));
    }

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthenticated(false);
        setCurrentUser(null);
        history.push('/');
        history.go(0);
    }

    const expiryLogout = () => {
        let token = localStorage.getItem("accessToken")
        let payload = decodeToken(token)
        let expiry = Date().getTime() > payload.exp * 1000 
        setTimeout(()=> logout(), expiry)
    }

    const setupUser = (response) => {
        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("refreshToken", response.refresh_token);
    }


    const loadCurrentUser = () => {
        if (localStorage.getItem("accessToken")) {
            getCurrentUser()
            .then((response) => {
                setAuthenticated(true)
                localStorage.setItem("userMeta", JSON.stringify(response))
                setCurrentUser(response)
            })
            .catch((e) => {
                if (e.status === 401) {
                    if (e.detail == "Expired"){
                    }
                }
                setAuthenticated(false)
                setCurrentUser(null)
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userMeta");
                history.push('/login');
                history.go(0);
            });
        }
    };

    useLayoutEffect(() => {
            loadCurrentUser()
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                authenticated: authenticated,
                currentUser: currentUser,
                logout: logout,
                setupUser: setupUser,
                loadCurrentUser: loadCurrentUser
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider;

export const useGlobalContext = () => useContext(GlobalContext)
