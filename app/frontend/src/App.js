import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './components/Common/Loading';
import { Background } from './components/Common/PageElement';
import Footer from './components/FooterComponent';
import Navbar from './components/NavBar';
import GlobalContextProvider from "./context-provider";
import { LoadContext } from './LoadContext';

import Home from "./pages/Home";
import About from './pages/About';
import Contact from './pages/Contact';
import Team from './pages/Team';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';

import Live from './pages/Live/';
import Standard from './pages/Standard';
import Result from './pages/Result';

import GlobalStyle from './StyledGlobal';

const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    }
});


function App() {
    const [load, setLoad] = useState(false)
    const [progress, setProgress] = useState(0)

    const changeProgress = (prog) => {
        setProgress(prog)
    }

    return (
        <Fragment>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
                <Router>
                    <GlobalContextProvider>
                        {load ?
                            <Loading progress={progress} />
                            :
                            <LoadContext.Provider value={{ load, setLoad }}>
                                <Background>
                                    <Navbar />
                                    <Switch>
                                        {/* <Route path='/' exact component={Home} /> */}
                                        <Route path='/' exact>
                                            <Home changeProgress={changeProgress} />
                                        </Route>
                                        <Route path='/home' component={Home} />
                                        <Route path='/about' component={About} />
                                        <Route path='/contact' component={Contact} />
                                        <Route path='/team' component={Team} />
                                        <Route path='/signup' component={Signup} />
                                        <Route path='/login' component={Login} />
                                        <Route path='/profile' component={Profile} />
                                        <Route path='/live' component={Live} />
                                        <Route path='/standard' component={Standard} />
                                        <Route path='/result' component={Result} />
                                    </Switch>
                                    <Footer />
                                </Background>
                            </LoadContext.Provider>
                        }
                    </GlobalContextProvider>
                </Router>
            </ThemeProvider>
        </Fragment>
    );
}

export default App;