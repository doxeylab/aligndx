import { Fragment } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ScienceIcon from '@mui/icons-material/Science';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Divider, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';

export default function SideBarItems() {
    const router = useRouter();

    const navigate = ((route: string) => {
        router.push(`/${route.toLocaleLowerCase()}`)
    })

    const icons = {
        'Dashboard': <DashboardIcon />,
        'Analyze': <ScienceIcon />,
        'Archive': <InventoryIcon />,
    }
    return (
        <>
            <Fragment>
                {Object.entries(icons).map(([key, value]) => {
                    return (
                        <Tooltip key={key} title={key} placement='right' arrow enterTouchDelay={0} leaveTouchDelay={400}>
                            <ListItemButton onClick={() => { navigate(key) }}>
                                <ListItemIcon sx={{ "&:hover": { color: "primary.main" } }}>
                                    {value}
                                </ListItemIcon>
                                <ListItemText primary={key} />
                            </ListItemButton>
                        </Tooltip>

                    )
                })}
                <Divider sx={{ my: 1 }} />
            </Fragment>
        </>
    )
}