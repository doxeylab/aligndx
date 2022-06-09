import { useState, useEffect} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const DropdownMenu = ({ category, formlabel, label, options, placeholder, val, valueCallback }) => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        valueCallback(data);
    }, [data])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        if (!event.target.value.includes('header')) {
            setData(
                // On autofill we get a stringified value.
                typeof value === 'string' ? value.split(', ') : value,
            );
        }
    }

    return (
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel>{formlabel}</InputLabel>
                <Select 
                    multiple
                    value={data}
                    label={formlabel}
                    onChange={handleChange}
                    MenuProps={MenuProps}
                >
                    {options.map((opt) => (
                        <MenuItem
                            key={opt}
                            value={opt}
                        >
                            {opt}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    )

}

export default DropdownMenu