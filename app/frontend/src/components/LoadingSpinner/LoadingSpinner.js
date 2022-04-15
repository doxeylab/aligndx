import Spinner from '../../assets/Common/LoadingDNA.gif';
import { Stack } from '@mui/material';


const LoadingSpinner = () => {
    return (
        <>
        <Stack direction="column" justifyContent="center" alignItems="center">
            <p> Hang on! Your data is being analyzed</p>
            <img src={Spinner} className='fp-loader' alt='loading' width={"50%"} />
        </Stack>
        </>
    )
}

export default LoadingSpinner;
