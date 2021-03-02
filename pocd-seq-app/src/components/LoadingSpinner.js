import React from 'react'
import Spinner from '../assets/Spinner.gif';


const LoadingSpinner = () => {
    return (
        <div className='fp-container'>
            <img src={Spinner} className='fp-loader' alt='loading'/>
        </div>
    )
}

export default LoadingSpinner;
