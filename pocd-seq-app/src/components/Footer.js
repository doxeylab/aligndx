import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (  
        <>
            <div className="footer">
                <div className="footer-content">

                </div>

                <div className="footer-bottom">

                            <div className="footer-copyright">
                                Copyright © AlignDx. All rights reserved.
                            </div>
                            <Link 
                                to='/privacy'
                                className='footer-bottom-link'
                                >
                                Privacy Policy
                            </Link>
                            <Link 
                                to='/termsofuse'
                                className='footer-bottom-link'
                                >
                                Term of Use
                            </Link>
                            <Link 
                                to='/sitemap'
                                className='footer-bottom-link'
                                >
                                Site Map
                            </Link>
                </div>    
            </div>
        </>
    );
}
 
export default Footer;