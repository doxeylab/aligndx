
import React, { useState } from 'react';

import { Grid } from '@mui/material';
import Barchart from '../../components/BarChart';
import AccordionComponent from '../../components/AccordionComponent'
import DataProgressBar from '../../components/DataProgressBar';

import LoadingSpinner from '../../components/LoadingSpinner'

const Results = ({ result }) => {

    return (
        <Grid>
            <AccordionComponent summary={
                <Grid container alignItems={"center"}>
                    <Grid item xs={10}>
                        <h1>
                            {result.sample_name}
                        </h1>
                    </Grid>
                    <Grid item xs={1}>
                        <DataProgressBar caption="Uploading..." endcaption="Uploaded" percentage={100 * result.progress.upload} />
                    </Grid>
                    <Grid item xs={1}>
                        <DataProgressBar caption="Analyzing..." endcaption="Analyzed" percentage={100 * result.progress.analysis} />
                    </Grid>
                </Grid>
            }>
                {result?.status === 'pending' ?
                    <LoadingSpinner />
                    :
                    <Barchart data={result} yLabel={result.ylabel} xLabel={result.xlabel} col="coverage" xkey="Pathogen" ykey="Coverage" />
                }

            </AccordionComponent>
        </Grid>
    )
}

export default Results;