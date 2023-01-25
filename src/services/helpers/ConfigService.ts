import get from 'lodash/get'
import { isProduction } from '../../util/enviroment'

interface IConfig {
  api: {
    baseUrl: string
  }
}

export interface ConfigServiceOptions {
  sandbox?: boolean
}

export class ConfigService {
  private isSandbox: boolean

  constructor(options?: ConfigServiceOptions) {
    this.isSandbox = options?.sandbox ?? !isProduction()
  }

  private get configs(): IConfig {
    return {
      api: {
        baseUrl: this.isSandbox
          ? 'https://sandbox.paggue.io/'
          : 'https://ms.paggue.io/'
      }
    }
  }

  get<TObject extends IConfig, TKey extends keyof TObject>(
    path: [TKey]
  ): TObject[TKey]
  get<
    TObject extends IConfig,
    TKey extends keyof TObject,
    TKey1 extends keyof TObject[TKey]
  >(path: [TKey, TKey1]): TObject[TKey][TKey1]
  get<
    TObject extends IConfig,
    TKey extends keyof TObject,
    TKey1 extends keyof TObject[TKey],
    TKey2 extends keyof TObject[TKey][TKey1]
  >(path: [TKey, TKey1, TKey2]): TObject[TKey][TKey1][TKey2]
  get(path: string[]) {
    return get(this.configs, path)
  }
}
