import React from 'react';

import { Grid } from '@mui/material';
import Barchart from '../../components/BarChart';

const Result = ({ result }) => {

    return (
        <Grid>
            <Barchart data={result} yLabel={result.ylabel} xLabel={result.xlabel} col="coverage" xkey="Pathogen" ykey="Coverage" />
        </Grid>
    )
}

export default Result;