import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AlignDx from '../assets/AlignDx.svg'



function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className='navBar'>

              <div className="menuWrap">
                  <Link to='/home'>
                      <img className="AlignDx" src={AlignDx} alt="AlignDx" />
                  </Link>


                  <div className='menuIcon' onClick={handleClick}>
                      <i className={click ? 'fas fa-times-circle' : 'fas fa-bars'} />
                  </div>
              </div>
              
              <ul className={click ? 'navMenu active' : 'navMenu'}>
                <li className='navItem'>
                  <Link
                    to='/about'
                    className='navLinks'
                    onClick={closeMobileMenu}
                  >
                    About
                  </Link>
                </li>
                <li className='navItem'>
                  <Link
                    to='/team'
                    className='navLinks'
                    onClick={closeMobileMenu}
                  >
                    Team
                  </Link>
                </li>
                <li className='navItem'>
                  <Link
                    to='/FAQ'
                    className='navLinks'
                    onClick={closeMobileMenu}
                  >
                    FAQ
                  </Link>
                </li>
                <li className='navItem'>
                  <Link
                    to='/contact'
                    className='navLinks'
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
              <div className="menuWrap">
                <Link to='/download'>
                    <button className='homeDownloadBtn'>Download App</button>
                </Link>
              </div>
      </nav>
    </>
  );
}

export default Navbar;
