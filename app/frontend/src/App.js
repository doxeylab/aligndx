import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/NavBar';
import Footer from './components/FooterComponent';
import Home from "./pages/Home";
import Contact from './pages/Contact';
import About from './pages/About';
import Team from './pages/Team';
import FAQ from './pages/FAQ';
import Result from './pages/Result';
import DownloadPage from './pages/DownloadPage';
import Policy from './pages/Policy';
import Services from './pages/Services';
import License from './pages/License';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import GlobalContextProvider from "./context-provider";

function App() {

    return (
        <Router>
            <GlobalContextProvider>
                <Navbar />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/home' component={Home} />
                    <Route path='/about' component={About} />
                    <Route path='/contact' component={Contact} />
                    <Route path='/FAQ' component={FAQ} />
                    <Route path='/team' component={Team} />
                    <Route path='/download' component={DownloadPage} />
                    <Route path='/results' component={Result} />
                    <Route path='/policy' component={Policy} />
                    <Route path='/license' component={License} />
                    <Route path='/services' component={Services} />
                    <Route path='/signup' component={Signup} />
                    <Route path='/login' component={Login} />
                    <Route path='/USER_ID' component={Profile} />
                </Switch>
                <Background />
                <Footer />
            </GlobalContextProvider>
        </Router>
    );
}

export default App;