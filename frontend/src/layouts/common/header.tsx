import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Logo from '@/components/logo'

export default function Header() {
    return (
        <AppBar
            sx={{
                background: 'transparent',
                boxShadow: 'none',
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                }}
            >
                <Logo
                    sx={{
                        width: 150,
                        height: 150,
                    }}
                />
            </Toolbar>
        </AppBar>
    )
}
