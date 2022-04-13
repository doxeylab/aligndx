import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, StyledTextField, StyledButton } from "./StyledForm";
import { CircularProgress } from "@mui/material";

const Form = ({ schema, onSubmit, name, btnlabel,loading, children }) => {
    const methods = useForm({
        resolver: yupResolver(schema)
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <FormContainer>
                    <h1>{name}</h1>
                    {children}
                    <StyledButton
                        size='large'
                        variant="contained"
                        type="submit"
                    >
                         {loading ? <CircularProgress size={25} /> : btnlabel}
                    </StyledButton>
                </FormContainer>
            </form>
        </FormProvider>
    );
}

export default Form;