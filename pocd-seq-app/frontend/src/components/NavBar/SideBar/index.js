// React
import React from 'react'
// Components
import {
    SidebarBtn,
    SidebarBtnLink,
    SidebarContainer,
    SidebarDivider,
    SidebarLink,
    SidebarMenu,
    SidebarProfile
} from './SidebarElement';
import {FaCogs, FaSignOutAlt, FaUserAlt} from 'react-icons/fa';
import {useGlobalContext} from "../../../context-provider";

const Sidebar = ({NavItems, MobileMenu, CloseClick}) => {
    const context = useGlobalContext();

    return (
        <SidebarContainer isOpen={MobileMenu}>
            <SidebarMenu>
                {NavItems.map((item, index) => {
                    return (
                        <SidebarLink key={index} activeStyle={{color: '#1861A6'}} to={item.url}
                                     onClick={CloseClick}>{item.title}</SidebarLink>
                    )
                })}
            </SidebarMenu>
            <SidebarDivider />
            {context.authenticated ?
                <>
                    <SidebarProfile>
                        <SidebarLink to="/USER_ID"
                                     onClick={CloseClick}>
                            <FaUserAlt style={{marginRight: "20px"}} />
                            {context.currentUser ? context.currentUser.name : ""}
                        </SidebarLink>
                        <SidebarLink to="/"
                                     onClick={CloseClick}>
                            <FaCogs style={{marginRight: "20px"}} />
                            Settings
                        </SidebarLink>
                        <SidebarLink to="/"
                                     onClick={() => {
                                         CloseClick();
                                         context.logout()
                                     }}>
                            <FaSignOutAlt style={{marginRight: "20px"}} />
                            Sign Out
                        </SidebarLink>
                    </SidebarProfile>
                </>
                :
                <>
                    <SidebarBtn>
                        <SidebarBtnLink to="/login" onClick={CloseClick}>
                            <span className="btn-text">Log In</span>
                        </SidebarBtnLink>
                    </SidebarBtn>
                    <SidebarBtn>
                        <SidebarBtnLink fill to="/signup" onClick={CloseClick}>
                            <span className="btn-text">Sign Up</span>
                        </SidebarBtnLink>
                    </SidebarBtn>
                </>
            }
        </SidebarContainer>
    )
}

export default Sidebar