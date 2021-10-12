// React
import React from 'react';
import Hero from '../components/HomeComponents/Hero';
import Tutorial from '../components/HomeComponents/Tutorial';
// import Aos from "aos";
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// // Components
// import { Title, Section } from '../components/PageElement'
// import HomePageArt from '../assets/HomePageArt.svg';
// import { Container, Row, Col } from 'react-bootstrap';
// import uploadImage from '../assets/uploadImage.svg';
// import analyzeImage from '../assets/analyzeImage.svg';
// import reportImage from '../assets/reportImage.svg';
// import AnalyzeHomeBtn from '../components/AnalyzeHomeBtn/AnalyzeHomeBtn';

const Home = () => {
    return (
        <>
            <Hero/>
            <Tutorial/>
        </>
    );
}

export default Home;