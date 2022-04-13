import React from 'react';

import Barchart from '../../components/BarChart';

const Result = ({ result }) => {

    return (
        <>
            <Barchart data={result.data} yLabel={result.ylabel} xLabel={result.xlabel} col="coverage" xkey="Pathogen" ykey="Coverage" />
        </>
    )
}

export default Result;