import React, {useState} from 'react';
import {FaUserAlt, FaCaretDown, FaCaretUp, FaCogs, FaSignOutAlt} from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import {
    ProfileBtn, 
    ProfileName,
    ProfileIcon,
    ProfileMenu,
    ProfileMenuList,
    ProfileMenuItem,
    Chevron
} from './StyledProfile';

const Profile = () => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
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
        ({ children, style}, ref) => {
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
                        <FaUserAlt/>
                    </ProfileIcon>
                    <ProfileName>William WL</ProfileName>
                    <Chevron>
                        <FaCaretDown />
                    </Chevron>
                </ProfileBtn>
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                <ProfileMenuItem><FaUserAlt/> Profile</ProfileMenuItem>
                <ProfileMenuItem><FaCogs /> Settings</ProfileMenuItem>
                <ProfileMenuItem><FaSignOutAlt /> Sign Out</ProfileMenuItem>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Profile