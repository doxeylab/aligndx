import React from 'react';
import {BtnText, Btn} from './StyledButton';

const Button = ({children, fill, disabled, ...buttonProps}) => {
    return (
        <Btn fill={fill} disabled={disabled} {...buttonProps}>
            <BtnText fill={fill} disabled={disabled}>{children}</BtnText>
        </Btn>
    )
}

export default Button;