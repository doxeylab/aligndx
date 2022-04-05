// React
import React from 'react';
import Hero from './Hero';
import Tutorial from './Tutorial'; 

const Home = (props) => {
    return (
        <>
            <Hero changeProgress={props.changeProgress}/>
            <Tutorial/>
        </>
    );
}

export default Home;