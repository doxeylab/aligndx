import { createGlobalStyle } from "styled-components";

export const size = {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1440px',
}

export const device = {
    xs: `(max-width: ${size.sm})`,
    sm: `(min-width: ${size.sm})`,
    md: `(min-width: ${size.md})`,
    lg: `(min-width: ${size.lg})`,
    xl: `(min-width: ${size.xl})`,
    xxl: `(min-width: ${size.xxl})`,
};

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 62.5%;
    }
    body &&& {
        margin: 0;
        padding: 0;
        width: 100%;
        font-family: 'Montserrat';
    }
    p {
        margin: 0;
    }

    a {
        text-decoration: none;
        color: #000;
        &:hover {
            text-decoration: none;
            color: #000;
        }
    }
`

export default GlobalStyle;