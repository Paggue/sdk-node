export const isTesting = () => process.env.NODE_ENV === 'testing'

export const isDevelopment = () =>
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local'

export const isProduction = () => process.env.NODE_ENV === 'production'
