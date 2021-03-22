import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (  
        <>
            <footer>
                <div className="footerContent">
                    <Link 
                        to='/services'
                        className='footerLink'
                        >
                        Our Services
                    </Link>
                    <Link 
                        to='/policy'
                        className='footerLink'
                        >
                        Privacy Policy
                    </Link>
                    <Link 
                        to='/license'
                        className='footerLink'
                        >
                        License
                    </Link>
                </div>
                <div className="footerBottom">
                    <div className="footerCopyright">
                        Copyright © Doxey-Hirota CoLab 2021, University of Waterloo Department of Biology. All rights reserved.
                    </div>    
                </div>    
            </footer>
        </>
    );
}
 
export default Footer;