// React
import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// Assets
import AlignDx from '../../assets/AlignDx.svg';
import { useGlobalContext } from "../../context-provider";
import Button from '../Button';
import { NavbarItems } from './NavbarItems';
import Profile from './Profile';
import Sidebar from './SideBar';
// Components
import {
    MobileIcon,
    Nav,
    NavBtn,
    NavContainer,
    NavItem,
    NavLink,
    NavLogo,
    NavMenu
} from './StyledNavbar';

const max_width = '992px';

const NavBar = () => {

    const context = useGlobalContext()
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
                    <img src={AlignDx} style={{ width: '150px', height: 'auto' }} alt="AlignDx" />
                </NavLogo>
                <MobileIcon onClick={handleMenuToggle}>
                    {mobileMenu ? <FaTimes /> : <FaBars />}
                </MobileIcon>
                <NavMenu activeMobile={mobileMenu}>
                    {NavbarItems.map((item, index) => {
                        return (
                            <NavItem key={index} onClick={closeMobileMenu} activeMobile={mobileMenu}>
                                <NavLink to={item.url} activeStyle={{ color: '#1861A6' }}>{item.title}</NavLink>
                            </NavItem>
                        )
                    })}
                </NavMenu>
                <Sidebar NavItems={NavbarItems} MobileMenu={mobileMenu} CloseClick={closeMobileMenu} />
                <NavBtn>
                    {context.authenticated ? (
                        <Profile />
                    )
                        : (
                            <>
                                <Link to="/login">
                                    <Button>Log In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button fill={true} to="/signup">Sign Up</Button>
                                </Link>
                            </>
                        )}
                </NavBtn>
            </NavContainer>
        </Nav>
    )
}

export default NavBar