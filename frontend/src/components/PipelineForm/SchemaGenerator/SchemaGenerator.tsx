import defaultValidationFields from "./defaultValidationFields" ; 
import getValidationSchema from "./getValidationSchema";

export default function SchemaGenerator(selectedPipelineInputs: any) {
    const validations = []
    for (const inp of selectedPipelineInputs) {
        const base = {
            name: inp.id,
            label: inp.title,
            validationType: 'array',
            validations: [
                {
                    type: 'required',
                    params: ['Required']
                },
                {
                    type: 'typeError',
                    params: ['Required']
                }
            ]
        }
        if (inp.input_type == 'file') {
            base['validationType'] = 'array'
            validations.push(base)
        }
        if (inp.input_type == 'text') {
            base['validationType'] = 'string'
            validations.push(base)
        }
        if (inp.input_type == 'select') {
            base['validationType'] = 'string'
            base['validations'].push({ "type": "oneof", "params": [inp.options] })
            validations.push(base)
        }
    }
    const combined = defaultValidationFields.concat(validations)
    const schema = getValidationSchema(combined as any)
    return schema
}