import Axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  CreateAxiosDefaults,
  AxiosResponse,
  CancelTokenSource,
  AxiosError,
  AxiosHeaders
} from 'axios'
import { Observable } from 'rxjs'
import { PaggueException } from '../../exceptions/PaggueException'
import { PaggueSdkOptions } from '../sdk/PaggueBaseService'
import { LogService } from './LogService'
import { signWithHmacSha512 } from '../../util/crypto'
import camelcaseKeys from 'camelcase-keys'

export class HttpService {
  protected instance: AxiosInstance = Axios
  protected logService: LogService = new LogService(HttpService.name)

  constructor(
    protected config: CreateAxiosDefaults &
      Pick<PaggueSdkOptions, 'signatureToken'>
  ) {
    this.instance = Axios.create(config)

    this.instance.interceptors.request.use((request) => {
      this.logService.info('External http resquest', { request })

      if (request.data && config.signatureToken) {
        request.headers.Signature = signWithHmacSha512(
          config.signatureToken,
          JSON.stringify(request.data)
        )
      }

      return request
    })

    this.instance.interceptors.response.use(
      async (response) => {
        if (response.data) {
          response.data = camelcaseKeys(response.data)
        }

        this.logService.info('External http resquest sucesss', {
          data: response.data
        })

        return response
      },

      (error: AxiosError) => {
        this.logService.error('External http resquest failed', {
          error: error.toJSON()
        })

        return new PaggueException(
          error.response?.data || 'Paggue external resquest failed',
          error.response?.status || 400,
          error
        )
      }
    )
  }

  request<T = any>(config: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(this.instance.request, config)
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(this.instance.get, url, config)
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(this.instance.delete, url, config)
  }

  head<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(this.instance.head, url, config)
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(this.instance.post, url, data, config)
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(this.instance.put, url, data, config)
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(this.instance.patch, url, data, config)
  }

  get axiosRef(): AxiosInstance {
    return this.instance
  }

  protected makeObservable<T>(
    axios: (...args: any[]) => AxiosPromise<T>,
    ...args: any[]
  ) {
    return new Observable<AxiosResponse<T>>((subscriber) => {
      const config: AxiosRequestConfig = { ...(args[args.length - 1] || {}) }

      let cancelSource: CancelTokenSource
      if (!config.cancelToken) {
        cancelSource = Axios.CancelToken.source()
        config.cancelToken = cancelSource.token
      }

      axios(...args)
        .then((res) => {
          subscriber.next(res)
          subscriber.complete()
        })
        .catch((err) => {
          subscriber.error(err)
        })

      return () => {
        if (config.responseType === 'stream') {
          return
        }

        if (cancelSource) {
          cancelSource.cancel()
        }
      }
    })
  }
}
