import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useEffect, useState } from 'react';
import { BootstrapInput } from './StyledForm';

const TextField = ({ defaultvalue, formlabel, placeholder, type, valueCallback, errorMsg, errorCallback }) => {
    const [value, setValue] = useState(defaultvalue === undefined ? `` : defaultvalue);
    const [error, setError] = useState(false)

    useEffect(() => {
        errorCallback(error);
        valueCallback(value);
    }, [value, error])

    const handleChange = (event) => {
        setValue(event.target.value)
        if (event.target.value === "") {
            setError(false)
        } else {
            switch (type) {
                case "email":
                    const regex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm)
                    setError(!regex.test(value))
                    break;
                default:
                    setError(false)
                // code block
            }
        }
    }

    return (
        <FormControl fullWidth>
            {formlabel !== undefined ?
                <FormLabel>{formlabel}</FormLabel>
                :
                ``
            }
            <BootstrapInput
                defaultValue={defaultvalue}
                onChange={handleChange}
                placeholder={placeholder}
                errorMsg={errorMsg}
            />
        </FormControl>
    )
}

export default TextField