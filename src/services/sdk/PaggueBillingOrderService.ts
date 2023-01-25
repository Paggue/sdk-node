import snakecaseKeys from 'snakecase-keys'
import { BaseService } from '../helpers/BaseService'
import { firstValueFrom, map } from 'rxjs'

export interface PagguePixProviderStaticPixRequest {
  externalId: string
  payerName: string
  amount: number
  description: string
}

export interface PagguePixProviderStaticPixResponse {
  hash: string
  payerName: string
  amount: number
  description: string
  payment: string
  externalId: string
  status: 'pending' | 'processing' | 'paid' | 'cancelled'
  paidAt: string | null
}

export class PaggueBillingOrderService extends BaseService {
  public async createStaticPayment(
    data: PagguePixProviderStaticPixRequest
  ): Promise<PagguePixProviderStaticPixResponse> {
    await this.authenticate()

    const response = this.httpService.post<PagguePixProviderStaticPixResponse>(
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
