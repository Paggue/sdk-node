import { firstValueFrom, map } from 'rxjs'
import { ConfigService } from './helpers/ConfigService'
import { checkSignatureWithHmacSha256 } from '../util/crypto'
import { CacheService } from './helpers/CacheService'
import { HttpService } from './helpers/HttpService'
import { LogService } from './helpers/LogService'
import { PaggueServices } from './PaggueServices'
import snakecaseKeys from 'snakecase-keys'

export enum PaggueServiceTypes {
  CashIn = 'payments',
  CashOut = 'cashout'
}

export interface PaggueSdkOptions {
  companyId: string
  clientKey: string
  clientSecret: string
  signatureToken: string
  sandbox: boolean
  debug: boolean
}

export interface PaggueAuthenticationResponse {
  accessToken: string
  tokenType: string
  expiresAt: string
}

export class PaggueBaseService {
  protected microservice: PaggueServiceTypes | undefined

  protected logService: LogService = new LogService(PaggueBaseService.name)

  protected cacheService: CacheService = PaggueServices.get(CacheService)

  protected configService: ConfigService = PaggueServices.get(ConfigService)

  protected httpService: HttpService = PaggueServices.get(HttpService, {
    signatureToken: this.options.signatureToken,
    baseURL: this.configService.get(['api', 'baseUrl']),
    headers: {
      'X-Company-Id': this.options.companyId
    }
  })

  constructor(protected options: PaggueSdkOptions) {}

  public async checkSignatureIsValid(signature: string, data: any) {
    return checkSignatureWithHmacSha256(signature, JSON.stringify(data))
  }

  protected endpoint(endpoint: string) {
    return `${this.microservice}/api/${endpoint}`.replace('//', '/')
  }

  /**
   * This method autheticate with Paggue API using client key and secret
   */
  protected async authenticate() {
    const authorizationKey = `Autorization:${this.options.clientKey}:${this.options.clientSecret}`

    let authorization = this.cacheService.get<string>(authorizationKey)

    if (!authorization) {
      const response = this.httpService.post<PaggueAuthenticationResponse>(
        `/payments/api/auth/login`,
        snakecaseKeys({
          clientKey: this.options.clientKey,
          clientSecret: this.options.clientSecret
        })
      )

      authorization = await firstValueFrom(
        response.pipe(
          map((response) => {
            return `${response.data.tokenType} ${response.data.accessToken}`
          })
        )
      )

      this.cacheService.set(authorizationKey, authorization)
    }

    this.httpService.axiosRef.defaults.headers.common.Authorization =
      authorization as any

    this.logService.info('Authorization success', { authorization })

    return this.httpService
  }
}
