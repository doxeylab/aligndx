import React, {useState, useEffect} from 'react';
import axios from 'axios';


const ResultAnalysis = () => {
  // eslint-disable-next-line
  const [result, setResult] = useState(null);
  const [sample, setSample] = useState(null);
  const [pathogen, setPathogen] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/results')
        .then(res => {
            setResult(res.data[0].detection_result)
            setSample(res.data[0].sample_name)
            setPathogen(res.data[0].detected_pathogen)
        })
        .catch(() => {
            console.log('Error')
        })
  }, [])
  
   return (    
     <>  
      <div className="Result">
          <header className="Result-header">
            <p>  
              <b>Rapid Pathogen Detection Test for sample {sample}</b>
            </p>
            <p>
              Your sample was <b>{result} </b>for {pathogen}
            </p>
          </header>
        </div>
     </>
   );
}

export default ResultAnalysis;