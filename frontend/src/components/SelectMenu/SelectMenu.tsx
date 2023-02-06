import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface SelectMenuProps {
    options: any;
    getOptionLabel: any;
    label: string;
    groupyBy?: any;
    [selMenuProps: string]: any;
}

export default function SelectMenu({options, groupBy, getOptionLabel, label, ...selMenuProps}: SelectMenuProps) {
    return (
        <Autocomplete 
            autoComplete
            id="sel-menu"
            renderInput={(params) => <TextField {...params} label={label} />}
            options={options}
            getOptionLabel={getOptionLabel}
            groupBy={groupBy? groupBy : null}
            {...selMenuProps}
        />
    )
}