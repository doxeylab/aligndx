import { createTheme, responsiveFontSizes } from '@mui/material';
// Create a theme instance.
const basetheme = createTheme({
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
                    borderColor: "#5893df",
                },
            },
        },
    },
})

const theme = responsiveFontSizes(basetheme)
export default theme;