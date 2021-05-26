// React
import React from 'react'
// Components
import {SidebarContainer, SidebarMenu, SidebarLink, SidebarBtn, SidebarBtnLink} from './SidebarElement';

const Sidebar = ({NavItems, MobileMenu, CloseClick}) => {
    return (
        <SidebarContainer isOpen={MobileMenu}>
            <SidebarMenu>
                {NavItems.map((item, index) => {
                    return (
                        <SidebarLink key={index} activeStyle={{color: '#1861A6'}} to={item.url} onClick={CloseClick}>{item.title}</SidebarLink>
                    )
                })}
            </SidebarMenu>
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
        </SidebarContainer>
    )
}

export default Sidebar