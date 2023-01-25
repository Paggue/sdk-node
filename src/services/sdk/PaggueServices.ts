import { PaggueSdkOptions } from '../helpers/BaseService'
import { ConfigService } from '../helpers/ConfigService'
import { PaggueBillingOrderService } from './PaggueBillingOrderService'
import { PaggueCashoutService } from './PaggueCashOutService'

interface PaggueServiceIntanceOptions {
  replace?: boolean
  scope?: string
}

interface PaggueServiceConstructor<Options, Contract> {
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
  static get<Contract extends AnyObject, Options extends AnyObject>( // eslint-disable-line
    Service: PaggueServiceConstructor<Options, Contract>,
    serviceArguments: Options | any[] = [],
    options: PaggueServiceIntanceOptions = {}
  ): Contract {
    const { replace = false, scope = 'app' } = options

    const key = `${Service.name}|${scope}`

    console.log(Service.name, scope, this.instancesMap[key])

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

    PaggueServices.get(PaggueCashoutService, options, {
      scope,
      replace: true
    })
  }
}
