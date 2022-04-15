import React from 'react';

import Barchart from '../../components/BarChart';

function uid() {
    return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
  };

const Result = ({ result }) => {
    if (result) {
        return (
            <>
            <Barchart id={uid()} data={result.data} yLabel={result.ylabel} xLabel={result.xlabel} xkey="Pathogen" ykey="Coverage" />
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