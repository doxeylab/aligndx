import React, {useContext, useEffect, useState} from 'react';
import {useQuery} from 'react-query'

import {useHistory} from "react-router-dom";
import { useUsers } from '../api/Users';

const GlobalContext = React.createContext({
    authenticated: false,
    currentUser: null,
    logout: () => {},
    setupUser: () => {},
    loadCurrentUser: () => {}
});

export const GlobalProvider = (props) => {

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
    const users = useUsers();
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
        localStorage.removeItem("userMeta");
        setAuthenticated(false);
        setCurrentUser(null);
        history.push('/login');
    }

    const expiryLogout = () => {
        let token = localStorage.getItem("accessToken")
        let payload = decodeToken(token)
        let expiry = (payload.exp * 1000) 
        console.log(expiry)
        // if (Date.now() >= expiry) {
        //     logout()
        // }
        // let expiry = new Date(payload.exp * 1000).getTime() 
    }

    const setupUser = (response) => {
        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("refreshToken", response.refresh_token);
    }

    const {status, data, error, refetch} = useQuery('user_data',users.me, {
          enabled: false,
          retry: false
      })

    const loadCurrentUser = () => {
        refetch()
    };

    useEffect(() => {
        if (status === "success") {
            setAuthenticated(true)
            localStorage.setItem("userMeta", JSON.stringify(data.data))
            setCurrentUser(data.data)
        }
        if (status === "error") {
            setAuthenticated(false)
            setCurrentUser(null)
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userMeta");
        }
    }, [status, data]) 

    useEffect(() => {
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

export default GlobalContext;

export const useGlobalContext = () => useContext(GlobalContext)
