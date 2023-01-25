import snakecaseKeys from 'snakecase-keys'
import { BaseService } from '../helpers/BaseService'
import { firstValueFrom, map } from 'rxjs'

export interface PaggueCashoutRequest {
  foo: string
}

export interface PaggueCashoutResponse {
  bar: string
}

export class PaggueCashoutService extends BaseService {
  public async createCashoutTransfer(
    data: PaggueCashoutRequest
  ): Promise<PaggueCashoutResponse> {
    await this.authenticate()

    const response = this.httpService.post<PaggueCashoutResponse>(
      `/cashout/api/bla-bla`,
      snakecaseKeys(data)
    )

    const staticPixData = response.pipe(map((response) => response.data))

    return firstValueFrom(staticPixData)
  }
}
