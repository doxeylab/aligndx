import { Fragment } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';

import { Tooltip } from '@mui/material';

export const sidebarItems = (
    <Fragment>
        <Tooltip title='Dashboard' placement='right' arrow enterTouchDelay={0} leaveTouchDelay={400}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
        </Tooltip> 
        <Tooltip title='Analyze' placement='right' arrow enterTouchDelay={0} leaveTouchDelay={400}>
            <ListItemButton>
                <ListItemIcon>
                    <ScienceIcon />
                </ListItemIcon>
                <ListItemText primary="Analyze" />
            </ListItemButton>
        </Tooltip>
        <Tooltip title='Results' placement='right' arrow enterTouchDelay={0} leaveTouchDelay={400}>
            <ListItemButton>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Results" />
            </ListItemButton>
        </Tooltip>
        <Tooltip title='Submissions' placement='right' arrow enterTouchDelay={0} leaveTouchDelay={400}>
            <ListItemButton>
                <ListItemIcon>
                    <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Submissions" />
            </ListItemButton>
        </Tooltip>
    </Fragment>
);

export const secondaryListItems = (
    <Fragment>
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
);