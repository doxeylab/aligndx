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
            default: '#192231',
            paper: '#24344d',
        },
    }
})

const theme = responsiveFontSizes(basetheme)
export default theme;