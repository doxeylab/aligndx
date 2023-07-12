import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

export default function LogoButton() {
    const router = useRouter();
    return (
        <>
            <Button
                onClick={() => { router.push('/') }}
                sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }}
            >
                <img src='assets/aligndx_logo.svg' alt='logo-icon' width="200px" height="auto" />
            </Button>
        </>
    )
}