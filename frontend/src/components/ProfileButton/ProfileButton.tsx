import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router'
import { Fragment, MouseEvent, useState } from 'react';

interface MenuObject {
    item: string;
    onClick(): string;
}

interface ProfileButtonProps {
    menu: MenuObject[];
}

export default function ProfileButton() {
    const router = useRouter();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <>
            <Fragment>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar />
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {/* <MenuItem key={'settings'}
                        onClick={() => {
                            handleCloseUserMenu()
                            router.push('/settings')
                        }}>
                        <Typography textAlign="center">Settings</Typography>
                    </MenuItem> */}
                    <MenuItem key={'logout'}
                        onClick={() => {
                            handleCloseUserMenu()
                        }}>
                        <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Fragment>
        </>
    )
}