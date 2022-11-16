import { Fragment } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Divider, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';

export default function SideBarItems() {
    const router = useRouter();

    const navigate = ((route: string) => {
        router.push(`/${route.toLocaleLowerCase()}`)
    })

    let icons = {
        'Dashboard': <DashboardIcon />,
        'Analyze': <ScienceIcon />,
        'Results': <BarChartIcon />,
        'Submissions': <HistoryIcon />
    }
    return (
        <>
            <Fragment>
                {Object.entries(icons).map(([key, value]) => {
                    return (
                        <Tooltip title={key} placement='right' arrow enterTouchDelay={0} leaveTouchDelay={400}>
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
                <ListSubheader component="div" inset>
                    Saved reports
                </ListSubheader>
                <ListItemButton>
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sample1" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sample2" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sample3" />
                </ListItemButton>
            </Fragment>
        </>
    )
}