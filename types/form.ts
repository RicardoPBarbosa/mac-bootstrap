export type FormInputs = {
  name: { value: string }
  logo: { value: string }
  packageName: { value: string }
}

export type ValidationFields = {
  selectedManager: string
  name: string
  logo: string
  packageName: string
}

export type ErrorProps = {
  selectedManager: string
  name: string
  logo: string
  packageName: string
}
