// React
import React, {useState, useEffect} from 'react';
// Components
import {
    Nav,
    NavContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
    NavLink,
    NavBtn,
    NavBtnLink
    } from './NavbarElement';
import {FaBars, FaTimes} from 'react-icons/fa';
import {NavbarItems} from './NavbarItems';
import Sidebar from './SideBar';
import Profile from './Profile';
// Assets
import AlignDx from '../../assets/AlignDx.svg';

const max_width = '992px';

const NavBar = ({authenticated}) => {
    const [mobileMenu, setMobileMenu] = useState(false);

    const handleMenuToggle = () => {
        setMobileMenu(!mobileMenu);
    };

    const closeMobileMenu = () => {
        setMobileMenu(false);
    };

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > max_width) {
                setMobileMenu(false)
            }
        }
        window.addEventListener('resize', handleResize)
    }, [])

    return (
        <Nav>
            <NavContainer>
                <NavLogo to="/" onClick={closeMobileMenu}>
                    <img src={AlignDx} style={{width:'150px',height:'auto'}} alt="AlignDx"/>
                </NavLogo>
                <MobileIcon onClick={handleMenuToggle}>
                    {mobileMenu ? <FaTimes/> : <FaBars />}
                </MobileIcon>
                <NavMenu activeMobile={mobileMenu}>
                    {NavbarItems.map((item, index) => {
                        return (
                            <NavItem key={index} onClick={closeMobileMenu} activeMobile={mobileMenu}>
                                <NavLink to={item.url} activeStyle={{color: '#1861A6'}}>{item.title}</NavLink>
                            </NavItem>
                        )
                    })}
                </NavMenu>
                <Sidebar authenticated={authenticated} NavItems={NavbarItems} MobileMenu={mobileMenu} CloseClick={closeMobileMenu}/>
                <NavBtn>
                    {authenticated ? (
                        <Profile/>
                    )
                    : (
                        <>                 
                            <NavBtnLink to="/login">
                                <span className="btn-text">Log In</span>
                            </NavBtnLink>
                            <NavBtnLink fill to="/login">
                                <span className="btn-text">Sign Up</span>
                            </NavBtnLink>
                        </>
                    )}
                </NavBtn>
            </NavContainer>
        </Nav>
    )
}

export default NavBar