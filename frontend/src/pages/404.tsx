import { Button, Container, Stack, Typography } from "@mui/material"
import { useRouter } from "next/router"

export default function NotFound() {
    const router = useRouter();
    return (
        <>
            <Container>
                <Stack
                    justifyContent="center"
                    alignItems="center"
                >
                    <img src={'assets/NotFound.svg'} alt='notfound' />
                    <Typography variant='h2'> Lost friend?</Typography>
                    <Button onClick={() => router.push('/')}>
                        Go back home
                    </Button>
                </Stack>
            </Container>
        </>
    )
}