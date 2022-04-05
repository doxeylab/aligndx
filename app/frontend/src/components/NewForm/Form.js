import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, StyledTextField, StyledButton } from "./StyledForm";

const Form = ({ schema, onSubmit, name, btnlabel, children }) => {
    let schema_names = Object.keys(schema.fields)
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormContainer>
                <h1>{name}</h1>
                <>
                    {schema_names.map((s) =>
                        <Controller
                            name={s}
                            control={control}
                            defaultValue=""
                            render={({ field }) =>
                                <>
                                    <StyledTextField
                                        {...field}
                                        id="filled-basic"
                                        type={s}
                                        label={s.replace(/(?<=\b)[a-z](?=\w*)/g, c => c.toUpperCase())}
                                        variant="filled"
                                        error={!!errors[s]}
                                        helperText={errors[s] ? errors[s]?.message : ''} />
                                </>
                            }
                        />
                    )}
                </>
                {children}
                <StyledButton
                    size='large'
                    variant="contained"
                    type="submit" 
                    >
                    {btnlabel}
                    </StyledButton>
            </FormContainer>
        </form>
    );
}

export default Form;