import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalStyle from './StyledGlobal';
import { CssBaseline, GlobalStyles } from "@mui/material";

import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loading from './components/Common/Loading';
import { Background } from './components/Common/PageElement';
import Footer from './components/FooterComponent';
import Navbar from './components/NavBar';

import { LoadContext } from "./context/LoadContext"
import { AuthProvider} from './context/AuthProvider';

import Home from "./pages/Home";
import About from './pages/About';
import Contact from './pages/Contact';
import Team from './pages/Team';

import Signup from './pages/Signup';
import Login from './pages/Login';
import MyResults from './pages/MyResults';
import Pricing from './pages/Pricing';

import Live from './pages/Live/';
import Result from './pages/Result';

import Checkout from './pages/Checkout';
import Settings from './pages/Settings';

import NotFound from './pages/NotFound';
import TestPage from './pages/TestPage';
import Protected from './pages/Protected';

import { Paper } from '@mui/material';
import { grey, blue, amber, indigo } from '@mui/material/colors';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'

import { ReactQueryDevtools } from 'react-query/devtools'
import context from 'react-bootstrap/esm/AccordionContext';

const getDesignTokens = (mode) => ({
    typography: {
        fontFamily: 'Montserrat',
        fontSize: 18,
    },
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: {
                    main: '#2578c7'
                },
                text: {
                    primary: grey[900],
                    secondary: grey[800],
                },
            }
            : {
                // palette values for dark mode
                primary: {
                    main: indigo[900]
                },
                background: {
                    default: indigo[800],
                    paper: indigo[400],
                },
                text: {
                    primary: grey[50],
                    secondary: grey[50],
                },
                error: {
                    main: amber[400]
                },
            }),
    },
});

const queryClient = new QueryClient();

function App() {
    const [load, setLoad] = useState(false)
    const [mode, setMode] = useState('light')
    const theme = createTheme(getDesignTokens(mode));

    return (
        <Fragment>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles
                // styles={{
                //     body: { backgroundColor: "#7caedd" },
                // }}
                />
                <Paper>
                    <Router>
                        <QueryClientProvider client={queryClient}>
                            <AuthProvider>
                                {load ?
                                    <Loading />
                                    :
                                    <LoadContext.Provider value={{ load, setLoad }}>
                                        <Background>
                                            <Navbar />
                                            <Routes>
                                                {/* public */}
                                                <Route path='/' element={<Home />} />
                                                <Route path='/about' element={<About />} />
                                                <Route path='/contact' element={<Contact />} />
                                                <Route path='/team' element={<Team />} />
                                                <Route path='/signup' element={<Signup />} />
                                                <Route path='/login' element={<Login />} />
                                                <Route path='/pricing' element={<Pricing />} />

                                                {/* private */}
                                                <Route element={<Protected />} >
                                                    <Route path='/home' element={<Home />} />
                                                    <Route path='/myresults' element={<MyResults />} />
                                                    <Route path='/live' element={<Live />} />
                                                    <Route path='/result' element={<Result />} />
                                                    <Route path='/checkout' element={<Checkout />} />
                                                    <Route path='/settings' element={<Settings />} />
                                                </Route>

                                                {/* tests */}
                                                {/* <Route path='/testpage' element={<TestPage/>}/> */}

                                                {/* 404 */}
                                                <Route path='*' element={<NotFound />} />
                                            </Routes>
                                            <Footer />
                                        </Background>
                                    </LoadContext.Provider>
                                }
                            </AuthProvider>
                            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                        </QueryClientProvider>
                    </Router>
                </Paper>
            </ThemeProvider>
        </Fragment>
    );
}

export default App;