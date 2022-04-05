import React from 'react';
import { Btn, BtnText } from './StyledButton';

const Button = ({ children, fill, to, disabled, ...buttonProps }) => {
    return (
        <Btn type="button" fill={fill ? true : false} disabled={disabled} {...buttonProps}>
            <BtnText fill={fill ? true : false} disabled={disabled}>{children}</BtnText>
        </Btn>
    )
}

export default Button;