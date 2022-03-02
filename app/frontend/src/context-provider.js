import React, {useContext, useLayoutEffect, useState} from 'react';
import {getCurrentUser} from "./http-common";
import {useHistory} from "react-router-dom";

const GlobalContext = React.createContext({
    authenticated: false,
    currentUser: null,
    logout: () => {},
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

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthenticated(false);
        setCurrentUser(null);
        history.push('/');
        history.go(0);
    }

    const loadCurrentUser = () => {
        if (localStorage.getItem("accessToken")) {
            getCurrentUser()
            .then((response) => {
                setAuthenticated(true)
                localStorage.setItem("userMeta", JSON.stringify(response))
                setCurrentUser(response)
            })
            .catch((_err) => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("userMeta");
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
                loadCurrentUser: loadCurrentUser
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider;

export const useGlobalContext = () => useContext(GlobalContext)
