import { FormProvider as Form, UseFormReturn } from 'react-hook-form'

interface FormProviderProps {
    children: React.ReactNode
    methods: UseFormReturn<any>
    onSubmit?: (data: any) => void // Updated the type of onSubmit
}

export default function FormProvider({
    children,
    onSubmit,
    methods,
}: FormProviderProps) {
    return (
        <Form {...methods}>
            <form onSubmit={onSubmit}>{children}</form>
        </Form>
    )
}
