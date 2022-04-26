import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalStyle from './StyledGlobal';
import { CssBaseline, GlobalStyles } from "@mui/material";

import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './components/Common/Loading';
import { Background } from './components/Common/PageElement';
import Footer from './components/FooterComponent';
import Navbar from './components/NavBar';

import { LoadContext } from "./context/LoadContext"
import { AuthProvider } from './context/AuthProvider';

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

import { Paper } from '@mui/material';
import { grey, blue, amber, indigo} from '@mui/material/colors';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'

import { ReactQueryDevtools } from 'react-query/devtools'

const getDesignTokens = (mode) => ({
    typography: {
        fontFamily: 'Montserrat',
        fontSize: '18',
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
                                        <Switch>
                                            {/* <Route path='/' exact component={Home} /> */}
                                            <Route path='/' exact>
                                                <Home />
                                            </Route>
                                            <Route path='/home' component={Home} />
                                            <Route path='/about' component={About} />
                                            <Route path='/contact' component={Contact} />
                                            <Route path='/team' component={Team} />
                                            <Route path='/signup' component={Signup} />
                                            <Route path='/login' component={Login} />
                                            <Route path='/myresults' component={MyResults} />
                                            <Route path='/live' component={Live} />
                                            <Route path='/result' component={Result} />
                                            <Route path='/pricing' component={Pricing} />
                                            <Route path='/checkout' component={Checkout} />
                                            {/* <Route path='/testpage' component={TestPage}/> */}
                                            <Route path='/settings' component={Settings} />
                                            <Route component={NotFound} />
                                        </Switch>
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