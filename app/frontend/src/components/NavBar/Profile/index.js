import React, {useState} from 'react';
import {FaCaretDown, FaCogs, FaSignOutAlt, FaUserAlt} from 'react-icons/fa';
import {Dropdown} from 'react-bootstrap';
import {
    Chevron,
    ProfileBtn,
    ProfileIcon,
    ProfileMenu,
    ProfileMenuItem,
    ProfileMenuList,
    ProfileName
} from './StyledProfile';
import {useGlobalContext} from "../../../context-provider";

const Profile = () => {
    const context = useGlobalContext();

    const CustomToggle = React.forwardRef(({children, onClick}, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </a>
    ));

    const CustomMenu = React.forwardRef(
        ({children, style}, ref) => {
            const [value, setValue] = useState('');

            return (
                <ProfileMenu ref={ref} style={style}>
                    <ProfileMenuList className="list-unstyled">
                        {React.Children.toArray(children).filter(
                            (child) =>
                                !value || child.props.children.toLowerCase().startsWith(value),
                        )}
                    </ProfileMenuList>
                </ProfileMenu>
            );
        },
    );

    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
                <ProfileBtn>
                    <ProfileIcon>
                        <FaUserAlt />
                    </ProfileIcon>
                    {/* <ProfileName>{user ? user.name : ""}</ProfileName> */}
                    <ProfileName>{context.currentUser ? context.currentUser.name : ""}</ProfileName>
                    <Chevron>
                        <FaCaretDown />
                    </Chevron>
                </ProfileBtn>
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                <ProfileMenuItem
                    href="/profile/"><FaUserAlt /> Profile</ProfileMenuItem>
                <ProfileMenuItem href="/settings"><FaCogs /> Settings</ProfileMenuItem>
                <ProfileMenuItem onClick={context.logout}><FaSignOutAlt /> Sign Out</ProfileMenuItem>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Profile