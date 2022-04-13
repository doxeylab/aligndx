import React from 'react';

import {Grid} from '@mui/material'
import Barchart from '../../components/BarChart';

const Result = ({ result }) => {

    return (
        <>
            <Barchart data={result.data} yLabel={result.ylabel} xLabel={result.xlabel} xkey="Pathogen" ykey="Coverage" />
        </>
    )
}

export default Result;