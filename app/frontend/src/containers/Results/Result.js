import React from 'react';

import Barchart from '../../components/BarChart';

const Result = ({ result }) => {
    if (result) {
        return (
            <>
            <Barchart data={result.data} yLabel={result.ylabel} xLabel={result.xlabel} xkey="Pathogen" ykey="Coverage" />
            </>
        )
    }
    else {
        return (
            <>
               There's no data for this submission!
            </>
        )
    }
}

export default Result;