import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Background from './components/Background';
import Footer from './components/FooterComponent';
import Navbar from './components/NavBar';
import GlobalContextProvider from "./context-provider";
import About from './pages/About';
import Contact from './pages/Contact';
import Home from "./pages/Home";
import Login from './pages/Login';
import Profile from './pages/Profile';
import Result from './pages/Result';
import Signup from './pages/Signup';
import Team from './pages/Team';

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
                    <Route path='/team' component={Team} />
                    <Route path='/results' component={Result} />
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