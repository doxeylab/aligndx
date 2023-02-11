import { Controller, useFormContext } from "react-hook-form";
import { StyledTextField } from "./StyledForm";

interface FormTextFieldProps {
    name: string;
    label: string;
    type: string;
    autoComplete?: string;
    hint?: string;
}

const FormTextField = ({name, label, type, autoComplete, hint } : FormTextFieldProps) => {
    const methods = useFormContext();
    return (
        <Controller
            name={name}
            control={methods?.control}
            defaultValue=""
            render={({ field } : any) =>
                <>
                    <StyledTextField
                        {...field} 
                        autoComplete={autoComplete? autoComplete : undefined}
                        id="filled-basic"
                        type={type}
                        label={label}
                        variant="filled"
                        error={!!methods?.formState.errors[name]}
                        helperText={methods?.formState.errors[name] ? methods?.formState.errors[name]?.message : (hint ? hint : " ")} />
                </>
            }
        />
    )
}

export default FormTextField;
