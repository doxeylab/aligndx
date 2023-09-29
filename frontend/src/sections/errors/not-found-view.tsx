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
                Sorry, we couldn&aposnt find that page.
            </Typography>

            <Image src={'assets/NotFound.svg'} alt="not-found" />

            <Button href="/" size="large" variant="contained">
                Go to Home
            </Button>
        </>
    )
}
