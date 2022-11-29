import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import Container from '@mui/material/Container'
import Uploader from '../../components/Uploader'

export default function Analyze() {
    
    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Uploader
                                id={'test'}
                                fileTypes={['.fastq','.fastq.gz']}
                                meta={
                                    {
                                        username: 'test'
                                    }
                                }
                                height={'100%'}
                                width={'100%'}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
