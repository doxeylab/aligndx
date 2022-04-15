import React from 'react';
import { Btn, BtnText } from './StyledButton';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, fill, to, disabled, ...buttonProps }) => {
    return (
        <MuiButton 
            variant='contained'
            disabled={disabled} 
            {...buttonProps}
            >
                {children}
        </MuiButton>
        // <Btn type="button" fill={fill ? true : false} disabled={disabled} {...buttonProps}>
        //     <BtnText fill={fill ? true : false} disabled={disabled}>{children}</BtnText>
        // </Btn>
    )
}

export default Button;