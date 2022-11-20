import { Paper, Grid } from '@mui/material';
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
                            <Uploader height={'100%'} width={'100%'} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        test
                    </Grid>
                    <Grid item xs={12}>
                        test
                    </Grid>
                </Grid>
            </Container>
        </>
    )
};
