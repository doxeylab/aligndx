import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

type Props = {
    children: React.ReactNode
}

export default function ThemeProvider({ children }: Props) {
    const theme = createTheme({
        palette: {
            mode: 'dark',
            // palette values for dark mode
            primary: {
                main: '#5893df',
            },
            secondary: {
                main: '#2ec5d3',
            },
            background: {
                default: '#13223a',
                paper: '#1c3963',
            },
        },
        components: {
            // Name of the component
            MuiTableCell: {
                styleOverrides: {
                    // Name of the slot
                    root: {
                        // Some CSS
                        borderColor: '#5893df',
                    },
                },
            },
        },
    })

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
}
