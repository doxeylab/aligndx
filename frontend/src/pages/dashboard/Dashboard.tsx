import { Paper, Grid } from '@mui/material';
import Container from '@mui/material/Container'
import dynamic from 'next/dynamic'

const Uploader = dynamic(
    () => import('../../components/Uploader'),
    { ssr: false }
)

const Dashboard = () => {

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Uploader height={'100%'} width={'100%'} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: "100%",
                                width: "100%"
                            }}
                        >
                            test
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: "100%",
                                width: "100%"
                            }}>
                            test
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
};

export default Dashboard;