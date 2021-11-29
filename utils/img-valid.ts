const isValid = (file: File): boolean => {
  return file.type === 'application/json' && file.name.includes('json')
}

export default isValid
