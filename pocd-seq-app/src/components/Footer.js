import React from 'react';
import { Link } from 'react-router-dom';

/*Footer is split into 2 sections*/

const Footer = () => {
    return (  
        <>
            <footer>
                {/* Section 1: Clickable Links */}
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
                    <a
                        href="https://storyset.com/"
                        className="footerLink" 
                        >
                        Storyset Illustrations
                    </a>
                </div>
                <div className="footerBottom">
                    {/* Section 2: Copyright Text */}
                    <div className="footerCopyright">
                        Copyright © Doxey-Hirota CoLab 2021, University of Waterloo Department of Biology. All rights reserved.
                    </div>    
                </div>    
            </footer>
        </>
    );
}
 
export default Footer;