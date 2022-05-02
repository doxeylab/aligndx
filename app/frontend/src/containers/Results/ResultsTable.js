import { useEffect, useState } from 'react';
import { useMutate, useQuery } from 'react-query'
import { useUsers } from '../../api/Users'
import { EnhancedTable } from "../../components/TableComponents";
import Result from "./Result";
import exampleresultstable from "../../assets/test_datasets/example_results_table.json"

const ResultsTable = () => {
    const [rows, setRows] = useState([])
    const example_data = exampleresultstable

    const users = useUsers()

    const submissions = useQuery('submissions', () => users.index_submissions(), {
        retry: false,
        enabled: true,
        onSuccess: (data, variables, context) => {
            data.data.forEach((data) => {
                rows.push(
                    createData(data.id, data.result, data.name, data.created_date, data.panel)
                )
            })

        },
        onError: (error) => {
            example_data.forEach((data) => {
                rows.push(
                    createData(data.id, data.result, data.name, data.created_date, data.panel)
                )
            })
        }
    })

    const createData = (id, data, name, created_date, panel) => {
        return {
            id,
            data,
            name,
            created_date,
            panel
        }
    }

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'File/Sample Name',
        },
        {
            id: 'created_date',
            numeric: true,
            disablePadding: false,
            label: 'Created Date',
        },
        {
            id: 'panel',
            numeric: true,
            disablePadding: false,
            label: 'Panel',
        },
    ];

    const contentgenerator = (data) => {
        return (
            <Result result={data} />
        )
    }

    const deletefn = (seldata) => {
        console.log(seldata)
    }

    return ( 
        <EnhancedTable
            tableName="My Results"
            rows={rows}
            headCells={headCells}
            contentgenerator={contentgenerator}
            deletefn={deletefn}
        >
        </EnhancedTable>

    )
}

export default ResultsTable;