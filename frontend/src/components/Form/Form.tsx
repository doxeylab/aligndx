import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react'

interface IForm {
    schema?: any;
    onSubmit?: any;
    children?: any;
}

const Form = ({ schema, onSubmit, children }: IForm) => {
    const [isSafeToReset, setIsSafeToReset] = useState(false);

    const methods = useForm({
        resolver: yupResolver(schema),
        mode: "all"
    });

    const handleSubmit = (data: any) => {
        try {
            onSubmit(data);
            setIsSafeToReset(true);
            methods.reset(methods.defaultValues); // asynchronously reset your form values

        }
        catch (e) {
            // do something
        }
    }

    // useEffect(() => {
    //     console.log(isSafeToReset)
    //     if (isSafeToReset) {
    //         methods.reset(methods.defaultValues); // asynchronously reset your form values
    //     }
    //     else {
    //         return;
    //     }
    // }, [isSafeToReset])

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
                {children}
            </form>
        </FormProvider>
    );
}

export default Form;