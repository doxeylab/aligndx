import React from 'react';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Contact from './pages/Contact';
import About from './pages/About';
import Team from './pages/Team';
import FAQ from './pages/FAQ';
import Result from './pages/Result';
import DownloadPage from './pages/DownloadPage';

  function App() {
    return (
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/contact' component={Contact} />
          <Route path='/FAQ' component={FAQ} />
          <Route path='/team' component={Team} />
          <Route path='/download' component={DownloadPage} />
          <Route path='/result' component={Result} />
        </Switch>
      </Router>
    );
  }
  
export default App;
