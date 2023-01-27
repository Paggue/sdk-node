import snakecaseKeys from 'snakecase-keys'
import { PaggueBaseService, PaggueServiceTypes } from './PaggueBaseService'
import { firstValueFrom, map } from 'rxjs'
import { LogService } from '../helpers/LogService'

export enum PaggueCashoutTypes {
  BankAccount = 0,
  PixKey = 1
}

export interface PaggueCashoutRequest {
  externalId: string
  amount: string
  type: PaggueCashoutTypes
  description: string
  bankAccount: {
    holder: string
    document: string
    account: string
    accountType: 'cc' | 'cp'
    accountDigit: string
    agency: string
    ispb: string
  }
}

export interface PaggueCashoutResponse {
  id: string
  externalId: string
  amount: string
  type: PaggueCashoutTypes
  description: string
  pixKey: string
  gateway: string
  reference: string
  bankAccount: {
    holder: string
    document: string
    account: string
    accountType: 'cc' | 'cp'
    accountDigit: string
    agency: string
    ispb: string
  }
}

export class PaggueCashoutService extends PaggueBaseService {
  protected logService: LogService = new LogService(PaggueCashoutService.name)
  protected microservice = PaggueServiceTypes.CashOut

  public async createTransfer(
    data: PaggueCashoutRequest
  ): Promise<PaggueCashoutResponse> {
    await this.authenticate()

    const response = this.httpService.post<PaggueCashoutResponse>(
      `/cashout/api/cash-out`,
      snakecaseKeys(data)
    )

    const staticPixData = response.pipe(map((response) => response.data))

    return firstValueFrom(staticPixData)
  }
}
