import { PaggueSdkOptions } from './PaggueBaseService'
import { ConfigService } from './helpers/ConfigService'
import { PaggueBillingOrderService } from './PaggueBillingOrderService'
import { PaggueCashOutService } from './PaggueCashOutService'

interface PaggueServiceIntanceOptions {
  replace?: boolean
  scope?: string
}

interface PaggueServiceConstructor<Contract, Options> {
  new (options: Options): Contract
  new (...args: any[]): Contract
}

export class PaggueServices {
  private static instancesMap: any = {}

  /**
   * Get a sdk class instance from service locator
   *
   * @see https://stackify.com/service-locator-pattern/
   *
   * @returns new Service(options)
   */
  static get<Contract extends AnyObject, Options extends AnyObject>(
    Service: PaggueServiceConstructor<Contract, Options>,
    serviceArguments: Options | any[] = [],
    options: PaggueServiceIntanceOptions = {}
  ): Contract {
    const { replace = false, scope = 'app' } = options

    const key = `${Service.name}|${scope}`

    if (!this.instancesMap[key] || replace) {
      this.instancesMap[key] = Array.isArray(serviceArguments)
        ? new Service(...serviceArguments)
        : new Service(serviceArguments)
    }

    return this.instancesMap[key]
  }

  static init(options: PaggueSdkOptions, scope?: string) {
    PaggueServices.get(ConfigService, options, {
      scope,
      replace: true
    })

    PaggueServices.get(PaggueBillingOrderService, options, {
      scope,
      replace: true
    })

    PaggueServices.get(PaggueCashOutService, options, {
      scope,
      replace: true
    })
  }
}
