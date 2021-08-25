import React, {useState} from "react";
import {CheckboxContainer, Input, Label, Indicator} from './StyleCheckbox';

const Checkbox = () => {
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        setChecked(!checked)
    }

    return (
        <CheckboxContainer onClick={handleCheck}>
            <Input
                type="checkbox"
                checked={checked}
            />
            <Indicator/>
            <Label>Remember Me</Label>
        </CheckboxContainer>
    );
}

export default Checkbox