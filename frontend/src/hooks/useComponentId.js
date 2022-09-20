import { useRef } from 'react';

const useIdGenerator = () => {
    const ref = useRef(0);
  
    function getId() {
      ref.current += 1;
      return ref.current;
    }
  
    return getId;
  }

export default useIdGenerator;