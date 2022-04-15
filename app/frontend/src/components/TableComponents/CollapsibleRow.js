import { useState } from 'react';

import Collapse from '@mui/material/Collapse';

import { TableCell, Box, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { Fade } from '@mui/material';

import { visuallyHidden } from '@mui/utils';

const CollapsibleRow = (props) => {
    const { hover, onClick, role, aria_checked, tabIndex, key, selected, content, length, children } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow
                hover={hover}
                role={role}
                aria-checked={aria_checked}
                tabIndex={tabIndex}
                key={key}
                selected={selected}
            >
                {children}
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open)
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell align='center' colSpan={length} sx={!open? visuallyHidden : null}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            {content}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </>
    )
}

export default CollapsibleRow;