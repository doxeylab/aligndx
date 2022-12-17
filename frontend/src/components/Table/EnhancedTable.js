import * as React from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container'
import { Snackbar, Alert } from '@mui/material';

import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolbar'
import CollapsibleRow from './CollapsibleRow';
import ConfirmDialog from '../ConfirmDialog';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable({ orderby, tableName, data, headCells, contentgenerator, deletefn }) {
    const [order, setOrder] = React.useState(orderby.order);
    const [orderBy, setOrderBy] = React.useState(orderby.id);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState(data);
    const [delDialog, setDelDialog] = React.useState(false);
    const [snackBar, setSnackBar] = React.useState(false);


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n[orderby.key]);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const filter = (items) => {
        setRows((prevRows) =>
            prevRows.filter((row) => !items.includes(row.key))
        );
        deletefn(items)
        setSelected([])
    }

    const handleOpenDelDialog = () => {
        setDelDialog(true);
    }

    const handleCloseDelDialog = () => {
        setDelDialog(false);
        setSnackBar(true);
    }

    const handleCloseSnackBar = () => {
        setSnackBar(false);
    }

    return (
        <Container>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Snackbar open={snackBar} autoHideDuration={4000} onClose={handleCloseSnackBar} >
                        <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
                            Record successfully deleted!
                        </Alert>
                    </Snackbar>
                    <ConfirmDialog
                        title={'Confirm Deletion'}
                        message={'Are you sure you want to delete these records?'}
                        open={delDialog}
                        close={handleCloseDelDialog}
                        onConfirm={() => filter(selected)}
                    />
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        tableName={tableName}
                        deletefn={handleOpenDelDialog}
                    />
                    <TableContainer >
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <EnhancedTableHead
                                headCells={headCells}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                emptycell={true}
                            />
                            <TableBody>
                                {rows.length > 0 ? null
                                    :
                                    <TableRow>
                                        <TableCell align='left' colSpan={headCells.length + 2}>
                                            There is nothing here yet ...
                                        </TableCell>
                                    </TableRow>}
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        let exclude = new Set([orderby.id, orderby.key])
                                        const remaining_rows = Object.fromEntries(Object.entries(row).filter(e => !exclude.has(e[0])))
                                        const isItemSelected = isSelected(row[orderby.key]);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <CollapsibleRow
                                                hover={true}
                                                role="checkbox"
                                                aria_checked={isItemSelected}
                                                tabIndex={-1}
                                                id={index}
                                                key={`collapsible-${index}`}
                                                selected={isItemSelected}
                                                length={headCells.length + 2}
                                                content={
                                                    <>
                                                        {contentgenerator ? contentgenerator(row) : null}

                                                    </>
                                                }
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                        onClick={(event) => handleClick(event, row[orderby.key])}

                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    onClick={(event) => handleClick(event, row[orderby.key])}

                                                >
                                                    {row[orderby.id]}
                                                </TableCell>
                                                {Object.entries(remaining_rows).map(([k, v]) => (
                                                    <TableCell
                                                        key={k}
                                                        align='right'
                                                        onClick={(event) => handleClick(event, row[orderby.key])}

                                                    >{v}</TableCell>
                                                ))
                                                }
                                            </CollapsibleRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </Container>
    );
}
