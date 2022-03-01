import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Row = (props) => {
    const [open, setOpen] = useState(false); 

    useEffect(() => {
        if (props.setSelectedData) {
            if (open == true) {
                props.setSelectedData(props)
            }
            else {
                props.setSelectedData(null)
            }
        }
    }, [open])

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    {props.name}
                </TableCell>
                {props.meta.map((val) => (
                    <TableCell>{val}</TableCell>
                ))}
                {props.changecollapse ?
                    <TableCell>{props.result}</TableCell>
                    :
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
                }
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            {props.result}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </React.Fragment>
    )
}

const BaseTable = (props) => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table" stickyHeader={true}>
                <TableHead >
                    <TableRow>
                        {props.headers.map((header) => (
                            <TableCell>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((row) => (
                        <Row id={row.id} name={row.name} meta={row.meta} result={row.result} changecollapse={props.changecollapse} setSelectedData={props.setSelectedData}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default BaseTable