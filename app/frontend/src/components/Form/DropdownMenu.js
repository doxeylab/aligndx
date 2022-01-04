import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { BootstrapInput, Placeholder } from './StyledForm';

const DropdownMenu = ({ category, formlabel, label, opt, options, placeholder, val, valueCallback }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        valueCallback(data);
    }, [data])

    const handleValue = (event) => {
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

    const renderSelectGroup = product => {
        const items = product['opts'].map((item, index) => {
            return (
                <MenuItem style={{ marginLeft: "10px" }} key={index} value={item[val]}>{item[label]}</MenuItem>
            );
        });
        return [<ListSubheader value="header" style={{ fontSize: "1.2rem" }}>{product[category]}</ListSubheader>, items];
    };

    return (
        <FormControl fullWidth>
            {formlabel !== undefined ?
                <FormLabel>{formlabel}</FormLabel>
                :
                ``
            }
            <Select
                value={data}
                displayEmpty
                multiple
                onChange={handleValue}
                renderValue={
                    data.length !== 0 ? undefined : () => <Placeholder>{placeholder}</Placeholder>
                }
                input={<BootstrapInput />}
            >
                {options?.map(opt => renderSelectGroup(opt))}
            </Select>
        </FormControl>
    )
}

export default DropdownMenu