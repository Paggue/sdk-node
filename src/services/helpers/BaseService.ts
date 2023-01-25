import { firstValueFrom, map } from 'rxjs'
import { ConfigService } from './ConfigService'
import { checkSignatureWithHmacSha512 } from '../../util/crypto'
import { CacheService } from './CacheService'
import { HttpService } from './HttpService'
import { LogService } from './LogService'
import { PaggueServices } from '../sdk/PaggueServices'
import { snakeKeys } from '../../util/case'

export interface PaggueSdkOptions {
  companyId: string
  clientKey: string
  clientSecret: string
  webhookToken: string
  sandbox: boolean
}

export interface PaggueAuthenticationResponse {
  accessToken: string
  tokenType: string
  expiresAt: string
}

export class BaseService {
  protected logService: LogService = new LogService(BaseService.name)

  protected cacheService: CacheService = PaggueServices.get(CacheService)

  protected configService: ConfigService = PaggueServices.get(ConfigService)

  protected httpService: HttpService = PaggueServices.get(HttpService, {
    baseURL: this.configService.get(['api', 'baseUrl']),
    headers: {
      'X-Company-Id': this.options.companyId
    }
  })

  constructor(protected options: PaggueSdkOptions) {}

  protected async checkSignatureIsValid(signature: string, data: any) {
    return checkSignatureWithHmacSha512(signature, JSON.stringify(data))
  }

  protected async authenticate() {
    const authorizationKey = `Autorization:${this.options.clientKey}:${this.options.clientSecret}`

    let authorization = this.cacheService.get<string>(authorizationKey)

    if (!authorization) {
      const response = this.httpService.post<PaggueAuthenticationResponse>(
        `payments/api/auth/login`,
        snakeKeys({
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

    this.httpService.axiosRef.defaults.headers.Authorization =
      authorization as any

    this.logService.info('Authorization success', { authorization })

    return this.httpService
  }
}
