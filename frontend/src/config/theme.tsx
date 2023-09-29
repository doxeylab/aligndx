'use client'
import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { typography } from './typography'

type Props = {
    children: React.ReactNode
}

export default function ThemeProvider({ children }: Props) {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#4A90E2',
            },
            secondary: {
                main: '#50E3C2',
            },
            error: {
                main: '#E94E77',
            },
            warning: {
                main: '#F5A623',
            },
            info: {
                main: '#4A90E2',
            },
            success: {
                main: '#7ED321',
            },
            background: {
                default: '#1A2331',
                paper: '#243447',
            },
        },
        typography: typography,
    })

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
}
