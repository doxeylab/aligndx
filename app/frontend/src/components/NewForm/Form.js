import { useForm, Controller} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, FormLabel, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormContainer, FormInput } from "./StyledForm";
import Button from '../../components/Button'

const Form = ({...props}) => {
    const schema = props.schema
    let schema_names = Object.keys(schema.fields)
    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
      });

    useEffect( () =>{
        console.log(errors)
    }, [errors])
    return (
        <FormContainer onSubmit={handleSubmit(props.onSubmit)}>
            {schema_names.map((s) =>
                <>
                    <TextField id="standard-basic" label={s} variant="standard" />

                    <FormInput {...register(s)}/>
                    <Alert severity="error">This is an error alert — check it out!</Alert>
                    <p>{errors[s]?.message}</p>
                </>
            )}
            <Button> Log in</Button>

        </FormContainer>
    );
}

export default Form;