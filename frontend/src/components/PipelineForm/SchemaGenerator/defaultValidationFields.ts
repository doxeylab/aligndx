const defaultValidationFields = [
    {
      name: 'name',
      label: 'Run Name',
      validationType: 'string',
      validations: [
        {
          type: 'required',
          params: ['Required']
        },
        {
          type: 'min',
          params: [8, 'Name should be 8 chars minimum.']
        },
        {
          type: 'max',
          params: [25, 'Exceeded name char limit']
        },
        {
          type: 'matches',
          params: [/^[a-zA-Z0-9_]+$/, '*No special characters except underscores' ]
        }
      ]
    },
  ]
  
export default defaultValidationFields