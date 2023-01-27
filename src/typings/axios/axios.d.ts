/* eslint-disable @typescript-eslint/naming-convention */
import Axios, { AxiosInstance as DefaultAxiosHeaders } from 'axios'

declare module 'axios' {
  export interface AxiosHeaders extends DefaultAxiosHeaders {
    Signature?: string
    Authorization?: string
  }
}
