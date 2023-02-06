import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

interface IForm { 
    schema?: any;
    onSubmit?: any;
    children?: any;
}

const Form = ({ schema, onSubmit, children} : IForm) => {
    const methods = useForm({
        resolver: yupResolver(schema),
        mode: "all"
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {children}
            </form>
        </FormProvider>
    );
}

export default Form;