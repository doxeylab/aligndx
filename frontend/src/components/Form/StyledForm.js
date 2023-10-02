import { styled } from '@mui/system';
import { TextField, Paper} from '@mui/material';

import Button from '@mui/material/Button';

export const FormContainer = styled(Paper)`
    box-shadow: 4px 6px 15px rgba(0, 0, 0, 0.2);
    border-radius: 1.2rem;
    padding: 3.5rem;
    justify-content: center;
    align-items: center;

    h1,h2,h3,h4,h5,h6 {
        color: inherit;
        margin-bottom: 2.5rem;
    }
`

export const StyledTextField = styled(TextField)`
    margin-bottom: 1em;
    width: 100%; 
` 

export const StyledButton = styled(Button)`
    margin-top: 1.5em;
    margin-bottom: 3em;
    padding: 1rem;
`