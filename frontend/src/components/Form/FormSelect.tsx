import { Controller, useFormContext } from "react-hook-form";
import SelectMenu from "../SelectMenu";
import TextField from '@mui/material/TextField';

interface FormSelectProps {
    name: string;
    options: any;
    getOptionLabel: any;
    label: string;
    groupBy?: any;
    [selMenuProps: string]: any;
}

const FormSelect = ({ name, options, getOptionLabel, label, groupBy, ...selMenuProps }: FormSelectProps) => {
    const methods = useFormContext();
    return (
        <Controller
            name={name}
            control={methods?.control}
            defaultValue=""
            render={({ field: { onChange, value } }: any) =>
                <>
                    <SelectMenu
                        options={options}
                        onChange={(event, item) => {
                            onChange(item);
                        }}
                        value={value || null}
                        getOptionLabel={getOptionLabel}
                        label={label}
                        groupBy={groupBy ? groupBy : null}
                        {...selMenuProps}
                        renderInput={(params) => (
                            < TextField
                                {...params}
                                error={!!methods?.formState.errors[name]}
                                helperText={methods?.formState.errors[name] ? methods?.formState.errors[name]?.message :" "}
                                label={label}
                            />
                        )

                        }

                    />
                </>
            }
        />
    )
}

export default FormSelect;
