import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import EnhancedTable from '../../components/Table'
import Download from '../../components/Download';
import Report from '../../components/Report';
import { useSubmissions } from '../../api/Submissions'


export default function Archive() {
    const [rows, setRows] = useState<any[]>([])
    const [client, setClient] = useState<boolean>(false)
    const submissions = useSubmissions();
    
    useEffect(() => {
        setClient(true)
    },[])
    function getTimezoneName() {
        const today = new Date();
        const short = today.toLocaleDateString(undefined);
        const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });
      
        // Trying to remove date from the string in a locale-agnostic way
        const shortIndex = full.indexOf(short);
        if (shortIndex >= 0) {
          const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
          
          // by this time `trimmed` should be the timezone's name with some punctuation -
          // trim it from both sides
          return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
      
        } else {
          // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
          return full;
        }
      }
      
    const timezone = getTimezoneName()
    // order matters
    const headCells = [
        {
            id: 'name',
            label: 'Name',
        },
        {
            id: 'pipeline',
            label: 'Pipeline',
        },
        {
            id: 'created_date',
            label: `Created (${timezone})`,
        },
        {
            id: 'finished_date',
            label: `Finished (${timezone})`,
        },
        {
            id: 'status',
            label: 'Status',
        },
    ];

    function createData(
        key: string,
        name: string,
        pipeline: string,
        created_date: string,
        finished_date: string,
        status: string
    ) {
        const dateGenerator = (date : string) => {
            if (date != null) {
                const iso = new Date(date).toLocaleString()
                return iso
            }
            else {
                return null
            }
        }
        const cdate = dateGenerator(created_date)
        const fdate = dateGenerator(finished_date)
        return {
            key,
            name,
            pipeline,
            cdate,
            fdate,
            status
        };
    }

    const all_submissions = useQuery({
        retry: 1,
        queryKey: ['submissions'],
        queryFn: () => submissions.index_submissions(),
        onSuccess(data: any) {
            const temp_rows = [] as any
            data.data.forEach((data: any) => {
                let status = data.status;
                if (status === 'queued' && data.position != null) {
                    status = `${status} in position ${data.position}`;
                }
                const row = createData(data.id, data.name, data.pipeline, data.created_date,data.finished_date, status)
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
        if (row.status == 'completed' || row.status == 'error') {
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
                        {client ? 
                        <EnhancedTable
                        orderby={{ 'order': 'desc', 'id': 'created_date', 'key': 'key' }}
                        tableName="Results"
                        rows={rows}
                        headCells={headCells}
                        deletefn={deletefn}
                        tools={tools}
                    /> :
                    null}
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
