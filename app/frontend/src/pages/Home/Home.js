// React
import React from 'react';
import Hero from './Hero';

const Home = (props) => {
    return (
        <>
            <Hero changeProgress={props.changeProgress}/>
        </>
    );
}

export default Home;