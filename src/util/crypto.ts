import { createHmac } from 'crypto'

export const signWithHmacSha256 = (secret: string, data: string) => {
  const hmac = createHmac('sha256', secret)
  const signature = hmac.update(Buffer.from(data, 'utf-8')).digest('hex')
  return signature
}

export const checkSignatureWithHmacSha256 = (
  signature: string,
  data: string
) => {
  if (!signature) {
    return false
  }

  return signature == signWithHmacSha256(signature, JSON.stringify(data))
}
