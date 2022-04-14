import React from 'react';

import Barchart from '../../components/BarChart';

const Result = ({ result }) => {

    return (
        <>
        <div>{JSON.stringify(result)}</div>
        <Barchart data={result.data} yLabel={result.ylabel} xLabel={result.xlabel} xkey="Pathogen" ykey="Coverage" />
        </>
    )
}

export default Result;