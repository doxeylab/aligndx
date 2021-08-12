import React, {useContext, useEffect, useState} from 'react';
import {getCurrentUser} from "./http-common";
import {useHistory} from "react-router-dom";

const GlobalContext = React.createContext({
    authenticated: false,
    currentUser: null,
    logout: () => {},
    loadCurrentUser: () => {}
});


const GlobalContextProvider = (props) => {

    const history = useHistory();
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthenticated(false);
        setCurrentUser(null);
        history.push('/');
    }

    const loadCurrentUser = () => {
        getCurrentUser()
            .then((response) => {
                setAuthenticated(true)
                setCurrentUser(response)
            })
            .catch((_err) => {
                localStorage.removeItem("accessToken");
            });
    };

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            loadCurrentUser()
        }
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
