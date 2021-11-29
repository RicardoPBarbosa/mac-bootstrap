import { ValidationFields } from 'types/form'

const validateFields = (fields: ValidationFields): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}
  for (const [key, value] of Object.entries(fields)) {
    errors[key] = ''
    if (typeof value === 'number' && !value) {
      errors[key] = `${key} is required`
    } else if (typeof value === 'string' && !value.trim().length) {
      errors[key] = `${key} is required`
    }
  }

  return errors
}

export default validateFields
