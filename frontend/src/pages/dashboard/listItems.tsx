import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { Tooltip } from '@mui/material';

export const mainListItems = (
    <React.Fragment>
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
    </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Saved reports
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current month" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Year-end sale" />
        </ListItemButton>
    </React.Fragment>
);