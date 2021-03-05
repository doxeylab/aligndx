import React from 'react'
import Spinner from '../assets/LoadingDNA.gif';
import Logo from '../assets/LOGO.svg'


const LoadingSpinner = () => {
    return (
        <div className='fp-container'>
            <img src={Spinner} className='fp-loader' alt='loading'/>
            <img src={Logo} className='logo-loader' alt='logo-loading' />
            <p>Please do not refresh or leave this page . . .</p>
        </div>
    )
}

export default LoadingSpinner;
