import snakecaseKeys from 'snakecase-keys'
import { PaggueBaseService, PaggueServiceTypes } from './PaggueBaseService'
import { firstValueFrom, map } from 'rxjs'
import { LogService } from '../helpers/LogService'

export interface PaggueBillingOrderCreateStaticPixRequest {
  externalId: string
  payerName: string
  amount: number
  description: string
}

export interface PaggueBillingOrderCreateStaticPixResponse {
  hash: string
  payerName: string
  amount: number
  description: string
  payment: string
  externalId: string
  status: 'pending' | 'processing' | 'paid' | 'cancelled'
  paidAt: string | null
}

export class PaggueBillingOrderService extends PaggueBaseService {
  protected microservice = PaggueServiceTypes.CashIn

  protected logService: LogService = new LogService(
    PaggueBillingOrderService.name
  )

  public async createStaticPayment(
    data: PaggueBillingOrderCreateStaticPixRequest
  ): Promise<PaggueBillingOrderCreateStaticPixResponse> {
    await this.authenticate()

    const response =
      this.httpService.post<PaggueBillingOrderCreateStaticPixResponse>(
        `/payments/api/billing_order`,
        snakecaseKeys(data)
      )

    const staticPixData = response.pipe(map((response) => response.data))

    return firstValueFrom(staticPixData)
  }

  public processStaticPayment(): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public createDynamicPayment(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
