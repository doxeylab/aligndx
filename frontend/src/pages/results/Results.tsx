import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

import EnhancedTable from '../../components/Table'
import Download from '../../components/Download';
import Report from '../../components/Report';
import { useSubmissions } from '../../api/Submissions'


export default function Results() {
    const [rows, setRows] = useState<any[]>([])
    const submissions = useSubmissions();

    // order matters
    const headCells = [
        {
            id: 'name',
            label: 'Name',
        },
        {
            id: 'created_date',
            label: 'Created Date',
        },
        {
            id: 'pipeline',
            label: 'Pipeline',
        },
        {
            id: 'status',
            label: 'Status',
        },
    ];

    function createData(
        key: string,
        name: string,
        created_date: string,
        pipeline: string,
        status: string
    ) {
        let date = new Date(created_date).toUTCString()
        return {
            key,
            name,
            date,
            pipeline,
            status
        };
    }

    const all_submissions = useQuery({
        retry: 1,
        queryKey: ['submissions'],
        queryFn: () => submissions.index_submissions(),
        onSuccess(data) {
            let temp_rows = []
            data.data.forEach((data: any) => {
                const row = createData(data.id, data.name, data.created_date, data.pipeline, data.status)
                temp_rows.push(row)
            })
            setRows(temp_rows)
        }
    })


    const del_records = (seldata: any) => {
        return submissions.del_record(seldata)
    }

    const sub_del = useMutation(['sub_del'], del_records, {
        retry: false,
    })

    const deletefn = (seldata: any) => {
        setRows((prevRows) =>
            prevRows.filter((row) => !seldata.includes(row.key))
        );
        sub_del.mutate(seldata)
    }

    const tools = (row: any) => {
        let disabled = true
        if (row.status == 'completed') {
            disabled = false
        }
        return (
            <Grid container justifyContent="center" alignItems="initial" >
                <Grid item>
                    <Report subId={row.key} disabled={disabled} />
                </Grid>
                <Grid item>
                    <Download subId={row.key} disabled={disabled}/>
                </Grid>
            </Grid>
        )
    }

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <EnhancedTable
                            orderby={{ 'order': 'desc', 'id': 'created_date', 'key': 'key' }}
                            tableName="Results"
                            rows={rows}
                            setRows={setRows}
                            headCells={headCells}
                            deletefn={deletefn}
                            tools={tools}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
