import { createHmac } from 'crypto'

export const signWithHmacSha512 = (secret: string, data: string) => {
  const hmac = createHmac('sha512', secret)
  const signature = hmac.update(Buffer.from(data, 'utf-8')).digest('hex')
  return signature
}

export const checkSignatureWithHmacSha512 = (
  signature: string,
  data: string
) => {
  if (!signature) {
    return false
  }

  return signature == signWithHmacSha512(signature, JSON.stringify(data))
}
