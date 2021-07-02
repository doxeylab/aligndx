// React
import React from 'react'
// Components
import {SidebarContainer, SidebarMenu, SidebarProfile, SidebarLink, SidebarBtn, SidebarBtnLink, SidebarDivider} from './SidebarElement';
import {FaUserAlt, FaCogs, FaSignOutAlt} from 'react-icons/fa';

const Sidebar = ({NavItems, MobileMenu, CloseClick, authenticated}) => {
    return (
        <SidebarContainer isOpen={MobileMenu}>
            <SidebarMenu>
                {NavItems.map((item, index) => {
                    return (
                        <SidebarLink key={index} activeStyle={{color: '#1861A6'}} to={item.url} onClick={CloseClick}>{item.title}</SidebarLink>
                    )
                })}
            </SidebarMenu>
            <SidebarDivider />
            {authenticated ?
                <>
                <SidebarProfile>
                    <SidebarLink activeStyle={{color: '#1861A6'}} to="/USER_ID" onClick={CloseClick}><FaUserAlt style={{marginRight: "20px"}}/> Profile</SidebarLink>
                    <SidebarLink activeStyle={{color: '#1861A6'}} to="/" onClick={CloseClick}><FaCogs style={{marginRight: "20px"}}/>Settings</SidebarLink>
                    <SidebarLink activeStyle={{color: '#1861A6'}} to="/" onClick={CloseClick}><FaSignOutAlt style={{marginRight: "20px"}}/>Sign Out</SidebarLink>
                </SidebarProfile>
                </>
            :
                <>
                <SidebarBtn>
                    <SidebarBtnLink to="/" onClick={CloseClick}>
                        <span className="btn-text">Log In</span>
                    </SidebarBtnLink>
                </SidebarBtn>
                <SidebarBtn>
                    <SidebarBtnLink fill to="/" onClick={CloseClick}>
                        <span className="btn-text">Sign Up</span>
                    </SidebarBtnLink>
                </SidebarBtn>
                </>
            }
        </SidebarContainer>
    )
}

export default Sidebar