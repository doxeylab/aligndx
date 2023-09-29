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
        <Grid container spacing={3} pt={5} pl={2} pr={2}>
          <Grid item container direction='row' justifyContent={'center'} alignItems="center" spacing={2}>
            <Grid item container direction={'column'} justifyContent="center" alignItems="center" spacing={2} sm={11} md={6}>
              <Grid item xs>
                <Typography variant="h2" align='center'> Automated, user-friendly bioinformatic data analyses</Typography>
              </Grid>
              <Grid item xs >
                <Typography align='center'> Analyze your data using common workflows for metagenomics, pathogen detection and other applications </Typography>
              </Grid>
              <Grid item xs >
                <Button variant="outlined" onClick={handleClick}> Register Now</Button>
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