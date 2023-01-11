import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import EnhancedTable from '../../components/Table'
import { useUsers } from '../../api/Users'
import { useEffect, useState } from 'react';
import { dehydrate, QueryClient, useQuery, useMutation } from '@tanstack/react-query';

// export async function getServerSideProps() {
//     const queryClient = new QueryClient()
//     const users = useUsers()

//     await queryClient.prefetchQuery(['submissions'],() => users.index_submissions())

//     return {
//       props: {
//         dehydratedState: dehydrate(queryClient),
//       },
//     }
//   }


export default function Results() {
    const [rows, setRows] = useState<any[]>([])

    const users = useUsers()

    interface HeadCell {
        id: string;
        label: string;
    }

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
    ];

    function createData(
        key: string,
        name: string,
        created_date: string,
        pipeline: string
    ) {
        let date = new Date(created_date).toUTCString()
        return {
            key,
            name,
            date,
            pipeline
        };
    }

    const submissions = useQuery({
        retry: false,
        queryKey: ['submissions'],
        queryFn: () => users.index_submissions(),
        onSuccess(data) {
            let temp_rows = []
            data.data.forEach((data: any) => {
                const row = createData(data.id, data.name, data.created_date, data.pipeline)
                temp_rows.push(row)
            })
            setRows(temp_rows)
        }
    })


    const del_records = (seldata: any) => {
        return users.del_record(seldata)
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
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
