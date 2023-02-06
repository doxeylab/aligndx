import { Controller, useFormContext } from "react-hook-form";
import SelectMenu from "../SelectMenu";

interface FormSelectProps {
    name: string;
    [selectMenuProps: string]: any;
}

const FormSelect = ({ name, ...selectMenuProps }: FormSelectProps) => {
    const methods = useFormContext();
    return (
        <Controller
            name={name}
            control={methods?.control}
            defaultValue=""
            render={({ field }: any) =>
                <>
                    <SelectMenu
                        {...field}
                        {...selectMenuProps}
                    />
                </>
            }
        />
    )
}

export default FormSelect;
