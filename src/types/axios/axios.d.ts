/* eslint-disable @typescript-eslint/naming-convention */
import { AxiosHeaders, AxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    signatureToken?: string
  }
  export interface AxiosHeaders {
    Signature?: string
    Authorization?: string
  }
}
