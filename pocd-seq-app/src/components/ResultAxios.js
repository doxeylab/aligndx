import React, {useState, useEffect} from 'react';
import axios from 'axios';


const ResultAxios = () => {
  // eslint-disable-next-line
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('http://206.12.123.7:8080/')
        .then(res => {
              setResult(res.data)
        })
        .catch(() => {
            console.log('Error')
        })
  }, [])

   return (
     <>

     </>
   )
}

export default ResultAxios;