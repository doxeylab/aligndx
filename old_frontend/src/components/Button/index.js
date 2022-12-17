import React from 'react';
import { Btn, BtnText } from './StyledButton';
import {Button as MuiButton} from '@mui/material'

const Button = ({ children, fill, to, disabled, variant, ...buttonProps }) => {
    return (
        <MuiButton 
            variant={variant? variant: 'contained'}
            disabled={disabled} 
            {...buttonProps}
            >
                {children}
        </MuiButton>
        // <Btn
        //     variant={variant? variant: 'contained'}
        //     fill={fill ? true : false} 
        //     disabled={disabled}
        //     color="error"
        //     {...buttonProps}
        //     >
        //     {children}
        // </Btn>
    )
}

export default Button;