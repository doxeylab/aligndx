// React
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// Assets
import AlignDx from '../../assets/Common/AlignDx.svg';
import { useGlobalContext } from "../../context-provider";
import Button from '../Button';
import { NavbarItems } from './NavbarItems';
import Profile from './Profile';
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

const NavBar = () => {
    const context = useGlobalContext()

    const [mobileMenu, setMobileMenu] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const closeMobileMenu = () => {
        setMobileMenu(false);
    };

    return (
        <Nav>
            <NavContainer>
                <NavLogo to="/" onClick={closeMobileMenu}>
                    <img src={AlignDx} style={{ width: '150px', height: 'auto' }} alt="AlignDx" />
                </NavLogo>
                <MobileIcon
                    id="basic-button"
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <FaBars />
                </MobileIcon>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            width: 150,
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {context.authenticated ? (
                        <div>
                            <MenuItem>
                                <ListItemIcon>
                                    <i className="fas fa-user"></i>
                                </ListItemIcon>
                                <p>My Profile</p>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <i className="fas fa-sign-out-alt"></i>
                                </ListItemIcon>
                                <p>Sign Out</p>
                            </MenuItem>
                        </div>
                    )
                        : (
                            <div>
                                <MenuItem>
                                    <ListItemIcon>
                                        <i className="fas fa-user-plus"></i>
                                    </ListItemIcon>
                                    <p>Sign Up</p>
                                    <Link to="/signup">
                                  
                                </Link>
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <i className="fas fa-sign-in-alt"></i>
                                    </ListItemIcon>
                                    <p>Log In</p>
                                    <Link to="/login">
                                 
                                </Link>
                                </MenuItem>
                            </div>
                        )}
                    <Divider />
                    {NavbarItems.map((item, index) => (
                        <MenuItem key={index}>
                            <p>{item.title}</p>
                        </MenuItem>
                    ))}
                </Menu>
                <NavMenu activeMobile={mobileMenu}>
                    {NavbarItems.map((item, index) => {
                        return (
                            <NavItem key={index} onClick={closeMobileMenu} activeMobile={mobileMenu}>
                                <NavLink to={item.url} activeStyle={{ color: '#1861A6' }}>{item.title}</NavLink>
                            </NavItem>
                        )
                    })}
                </NavMenu>
                <NavBtn>
                    {context.authenticated ? (
                        <Profile />
                    )
                        : (
                            <>
                                <Link to="/login">
                                    <Button >Log In</Button>
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