import get from 'lodash/get'

interface IConfig {
  sandbox: boolean
  debug: boolean
  api: {
    baseUrl: string
  }
}

export interface ConfigServiceOptions {
  sandbox: boolean
  debug: boolean
}

export class ConfigService {
  constructor(private options: ConfigServiceOptions) {}

  private get configs(): IConfig {
    return {
      ...this.options,
      api: {
        baseUrl: this.options.sandbox
          ? 'https://ms.paggue.io/'
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
