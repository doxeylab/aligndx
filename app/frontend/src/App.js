import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './components/Common/Loading';
import { Background } from './components/Common/PageElement';
import Footer from './components/FooterComponent';
import Navbar from './components/NavBar';
import GlobalContextProvider from "./context-provider";
import { LoadContext } from './LoadContext';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from "./pages/Home";
import Login from './pages/Login';
import Profile from './pages/Profile';
import RealTime from './pages/RealTime/';
import Result from './pages/Result';
import Signup from './pages/Signup';
import Team from './pages/Team';
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
                                    <Route path='/results' component={Result} />
                                    <Route path='/signup' component={Signup} />
                                    <Route path='/login' component={Login} />
                                    <Route path='/USER_ID' component={Profile} />
                                    <Route path='/realtime' component={RealTime} />
                                </Switch>
                                <Footer />
                            </LoadContext.Provider>
                        }
                    </GlobalContextProvider>
                </Router>
            </ThemeProvider>
            <Background />
        </Fragment>
    );
}

export default App;