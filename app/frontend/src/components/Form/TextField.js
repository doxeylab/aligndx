import { StyledTextField } from "./StyledForm"
import { Controller, useFormContext } from "react-hook-form";

const TextField = ({name, label, type, autoComplete, hint }) => {
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
                        inputProps={{ style: { fontSize: "1.3em"} }} // font size of input text
                        InputLabelProps={{ style: { fontSize: "1.3em" } }} // font size of input label
                        FormHelperTextProps={{ style: { fontSize: "1em"}}}
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

export default TextField;
