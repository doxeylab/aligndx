import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Fragment } from 'react';
import { useRouter } from "next/router";

export default function FeatureContainer() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/signup');
  }
  return (
    <Fragment>
      <Box sx={{ minHeight: 350 }}>
        <Grid container spacing={3}>
          <Grid item container direction='row' justifyContent={'center'} alignItems="center" spacing={2}>
            <Grid item container direction={'column'} justifyContent="left" alignItems="left" spacing={2} sm={11} md={6}>
              <Grid item xs>
                <Typography variant="h2"> Rapid Bioinformatic Clinical Analyses</Typography>
              </Grid>
              <Grid item xs >
                <Typography> Analyze your data with rapid, simple bioinformatic pipelines! </Typography>
              </Grid>
              <Grid item xs >
                <Button variant="outlined" onClick={handleClick}> Get Started</Button>
              </Grid>
            </Grid>
            <Grid item xs={5} md={6}>
              <img src='assets/data_extraction.svg' />
            </Grid>
          </Grid>
          <Grid item container direction='row' justifyContent={'center'} alignItems="center">
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}