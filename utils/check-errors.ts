import { ErrorProps } from 'types/form'

const hasErrors = (errors: ErrorProps): boolean => {
  for (const values of Object.values(errors)) {
    if (values.length) {
      return true
    }
  }
  return false
}

export default hasErrors
