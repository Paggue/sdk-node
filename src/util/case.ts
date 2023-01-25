import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

export const camelKeys = <T extends Record<string, any> | readonly any[]>(
  input: T
) => {
  return camelcaseKeys(input, { deep: true, pascalCase: false })
}

export const pascalKeys = <T extends Record<string, any> | readonly any[]>(
  input: T
) => {
  return camelcaseKeys(input, { deep: true, pascalCase: true })
}

export const snakeKeys = <T extends Record<string, any> | readonly any[]>(
  input: T
) => {
  return snakecaseKeys(input, { deep: true })
}
