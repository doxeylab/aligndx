
import React, { useState } from 'react';

import { Grid } from '@mui/material';
import AccordionComponent from '../../components/AccordionComponent'
import DataProgressBar from '../../components/DataProgressBar';
import Result from './Result';
import LoadingSpinner from '../../components/LoadingSpinner'

const ResultCard = ({ result }) => {

    return (
        <Grid>
            <AccordionComponent 
                summary={
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
                    <Result result={result} />
                }

            </AccordionComponent>
        </Grid>
    )
}

export default ResultCard;