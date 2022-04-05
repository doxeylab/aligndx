import { styled } from '@mui/system';

import { TextField, Button, Grid} from '@mui/material';

export const FormContainer = styled(Grid)`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 4px 6px 15px rgba(0, 0, 0, 0.2);
    border-radius: 1.2rem;
    width: 100%;
    padding: 3.5rem;
    justify-content: center;
    align-items: center;

    h1 {
        color: #1861a7;
        margin-bottom: 2.5rem;
    }
`

export const StyledTextField = styled(TextField)`
    margin-bottom: 1em;
    body { font-size: 1.6em }
    width: 100%;
` 

export const StyledButton = styled(Button)`
    margin-bottom: 3em;
    width: 25%;
    padding: 1rem;
`