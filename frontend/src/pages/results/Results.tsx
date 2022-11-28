import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import EnhancedTable from '../../components/Table'
import { useUsers } from '../../api/Users'
import { useState } from 'react';
import { dehydrate, QueryClient, useQuery, useMutation } from '@tanstack/react-query';

export async function getStaticProps() {
    const queryClient = new QueryClient()
    const users = useUsers()
  
    await queryClient.prefetchQuery(['submissions'],() => users.index_submissions())
  
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  }
  

export default function Results() {
    const [rows, setRows] = useState<any[]>([])
    const users = useUsers()

    const submissions = useQuery({
        retry: false,
        queryKey: ['submissions'],
        queryFn: () => users.index_submissions(),
    })

    if (submissions.isSuccess) {
        submissions.data?.data.forEach((data: any) => {
            const row = createData(data.id, data.result, data.name, data.created_date, data.panel)
            rows.push(row)
        })
    } 
    
    const del_records = (seldata: any) => {
        return users.del_record(seldata)
    }

    const sub_del = useMutation(['sub_del'], del_records, {
        retry: false,
    })

    interface HeadCell {
        id: string;
        label: string;
        numeric: boolean;
    }

    // order matters
    const headCells = [
        {
            id: 'name',
            numeric: false,
            label: 'File/Sample Name',
        },
        {
            id: 'created_date',
            numeric: true,
            label: 'Created Date',
        },
        {
            id: 'panel',
            numeric: true,
            label: 'Panel',
        },
    ];

    function createData(
        key: string,
        data: any,
        name: string,
        created_date: string,
        panel: string
    ) {
        return {
            key,
            data,
            name,
            created_date,
            panel
        };
    }

    const contentgenerator = (row: any) => {
        return (
            <div>
                {row.key}
            </div>
        )
    }

    const deletefn = (seldata: any) => {
        sub_del.mutate(seldata)
    }

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <EnhancedTable
                            orderby={{ 'order': 'desc', 'id': 'created_data', 'key': 'key' }}
                            tableName="Results"
                            data={rows}
                            headCells={headCells}
                            contentgenerator={contentgenerator}
                            deletefn={deletefn}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
