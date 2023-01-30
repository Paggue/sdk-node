import snakecaseKeys from 'snakecase-keys'
import { PaggueBaseService, PaggueServiceTypes } from './PaggueBaseService'
import { firstValueFrom, map } from 'rxjs'
import { LogService } from './helpers/LogService'

export enum PaggueCashoutTypes {
  BankAccount = 0
  // PixKey = 1
}

export interface PaggueCashoutCreateTransferRequest {
  externalId: string
  amount: number
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

export interface PaggueCashoutCreateTransferResponse {
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

export class PaggueCashOutService extends PaggueBaseService {
  protected logService: LogService = new LogService(PaggueCashOutService.name)
  protected microservice = PaggueServiceTypes.CashOut

  public async createTransfer(
    data: PaggueCashoutCreateTransferRequest
  ): Promise<PaggueCashoutCreateTransferResponse> {
    await this.authenticate()

    const response = this.httpService.post<PaggueCashoutCreateTransferResponse>(
      this.endpoint('/cash-out'),
      snakecaseKeys(data)
    )

    const staticPixData = response.pipe(map((response) => response.data))

    return firstValueFrom(staticPixData)
  }
}
