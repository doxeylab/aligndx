import { routes } from '@/routes'
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Image from 'next/image'

export default function NotFoundView() {
    return (
        <>
            <Typography variant="h3" sx={{ mb: 2 }}>
                Sorry, Page Not Found!
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
                {`We couldn't find the page you were looking for.`}
            </Typography>

            <Image
                src={'/assets/NotFound.svg'}
                alt="not-found"
                width={500}
                height={500}
                priority={true}
            />

            <Grid container direction={'row'} justifyContent={'center'}>
                <Button
                    href={routes.home}
                    variant="contained"
                    sx={{ width: '25%' }}
                >
                    Go Home
                </Button>
            </Grid>
        </>
    )
}
