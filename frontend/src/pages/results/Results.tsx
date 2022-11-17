import { Paper, Grid } from '@mui/material';
import Container from '@mui/material/Container'
import Table from '../../components/Table'

export default function Results() {

    return (
        <>
            <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Table />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
};
