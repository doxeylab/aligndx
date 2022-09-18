import { Controller, useFormContext } from "react-hook-form";
import { StyledTextField } from "./StyledForm";

const FormTextField = ({name, label, type, autoComplete, hint }) => {
    const methods = useFormContext();
    return (
        <Controller
            name={name}
            control={methods?.control}
            defaultValue=""
            render={({ field }) =>
                <>
                    <StyledTextField
                        {...field} 
                        autoComplete={autoComplete}
                        id="filled-basic"
                        type={type}
                        label={label.replace(/(?<=\b)[a-z](?=\w*)/g, c => c.toUpperCase())}
                        variant="filled"
                        error={!!methods?.formState.errors[name]}
                        helperText={methods?.formState.errors[name] ? methods?.formState.errors[name]?.message : (hint ? hint : " ")} />
                </>
            }
        />
    )
}

export default FormTextField;
