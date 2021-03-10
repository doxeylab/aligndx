import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (  
        <>
            <footer>
                <div className="footerContent">
                    <Link 
                        to='/privacy'
                        className='footerLink'
                        >
                        Our Services
                    </Link>
                    <Link 
                        to='/privacy'
                        className='footerLink'
                        >
                        Privacy Policy
                    </Link>
                    <Link 
                        to='/termsofuse'
                        className='footerLink'
                        >
                        Terms of Use
                    </Link>
                    <Link 
                        to='/sitemap'
                        className='footerLink'
                        >
                        Site Map
                    </Link>
                </div>
                <div className="footerBottom">
                    <div className="footerCopyright">
                        Copyright © AlignDx. All rights reserved.
                    </div>    
                </div>    
            </footer>
        </>
    );
}
 
export default Footer;