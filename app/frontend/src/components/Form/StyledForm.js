import InputBase from '@mui/material/InputBase';
import styled from 'styled-components';

export const BootstrapInput = styled(InputBase)`
    & .MuiInputAdornment-root {
        position: absolute;
        right: 9px;
    }
    & .MuiInputBase-input {
        position: relative;
        border: 1px solid ${props => props.errorMsg ? "#FF0000" : "#C4C4C4"};
        border-radius: 4px;
        font-size: 1rem;
        padding: 10px 39px 10px 12px;
        &:hover {
            border: 1px solid #333;
        }
    }
`

export const Placeholder = styled.p`
    color: #aaa;
`