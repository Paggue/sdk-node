/* eslint-disable @typescript-eslint/naming-convention */
import { AxiosHeaders } from 'axios'

declare module 'axios' {
  export interface AxiosHeaders {
    Signature?: string
    Authorization?: string
  }
}
