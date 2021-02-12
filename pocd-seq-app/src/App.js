import React from 'react';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Contact from './pages/Contact';
import About from './pages/About';
import Team from './pages/Team';
import FAQ from './pages/FAQ';


  function App() {
    return (
      <Router>
        <Navbar />
        <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/home' exact component={Home} />
        <Route path='/about' component={About} />
        <Route path='/contact' component={Contact} />
        <Route path='/FAQ' component={FAQ} />
        <Route path='/team' component={Team} />
        </Switch>
      </Router>
    );
  }
  
export default App;
