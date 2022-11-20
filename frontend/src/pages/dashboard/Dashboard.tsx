import { Paper, Grid } from '@mui/material';
import Container from '@mui/material/Container'

const Dashboard = () => {

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            Start a new Analyses
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: "100%",
                                width: "100%"
                            }}
                        >
                            Re-use the last pipeline you used
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8} lg={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            Analyses currently in progress
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: "100%",
                                width: "100%"
                            }}
                        >
                            Uploads in Progress
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
                            Recent Uploads
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
};

export default Dashboard;