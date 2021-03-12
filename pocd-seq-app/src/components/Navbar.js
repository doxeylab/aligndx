import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AlignDx from '../assets/AlignDx.svg'



function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className='navbar'>

          <Link to='/home'>
              <img className="AlignDx" src={AlignDx} alt="AlignDx" />
          </Link>

          <div className='wrap-menu'>
              <div className='menu-icon' onClick={handleClick}>
                  <i className={click ? 'far fa-minus-square' : 'fas fa-bars'} />
              </div>
        </div>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link
              to='/about'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              About
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/team'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Team
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/FAQ'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              FAQ
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/contact'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </li>
        </ul>
        
            <Link to='/download'>
                <button className='home-download-btn'>Download App</button>
            </Link>

      </nav>
    </>
  );
}

export default Navbar;
