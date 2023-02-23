import * as yup from 'yup'

interface IField {
  name: string;
  validationType: keyof typeof yup;
  validationTypeError?: string;
  validations?: {
    type: keyof yup.SchemaOf<any>;
    params?: any[];
  }[];
}

type YupFunction = (args?: any) => yup.SchemaOf<any>;

const getValidationSchema = (fields: IField[]) => {
  const schema = fields.reduce((schema: yup.ObjectSchema<any>, field: IField) => {
    const { name, validationType, validationTypeError = '', validations = [] } = field
    const isObject = name.indexOf('.') >= 0

    if (!yup[validationType]) {
      return schema
    }

    let validator = (yup[validationType] as YupFunction)().typeError(validationTypeError)
    validations.forEach((validation: { type: keyof yup.SchemaOf<any>, params?: any[] }) => {
      const { params, type } = validation
      if (!validator[type]) {
        return
      }
      validator = validator[type](...(params ?? []))
    })

    if (!isObject) {
      return schema.concat(yup.object().shape({ [name]: validator }))
    }

    const reversePath = name.split('.').reverse()
    const currNestedObject = reversePath.slice(1).reduce((yupObj: any, path: string) => {
      if (!isNaN(parseInt(path))) {
        return { array: yup.array().of(yup.object().shape(yupObj)) }
      }
      if (yupObj.array) {
        return { [path]: yupObj.array }
      }
      return { [path]: yup.object().shape(yupObj) }
    }, { [reversePath[0]]: validator })

    const newSchema = yup.object().shape(currNestedObject)
    return schema.concat(newSchema)
  }, yup.object().shape({}))

  return schema
}

export default getValidationSchema
