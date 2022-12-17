import Stack from '@mui/material/Stack';

export default function LoadingSpinner (props: any) {
    return (
        <>
            <Stack direction="column" justifyContent="center" alignItems="center">
                <p> Hang on! </p>
                <img src={'assets/LoadingDNA.gif'} className='fp-loader' alt='loading' width={"50%"} />
            </Stack>
        </>
    )
}