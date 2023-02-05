import { randomUUID } from 'crypto'
import { PaggueServices } from './services/PaggueServices'
import { PaggueBillingOrderService } from './services/PaggueBillingOrderService'

export * from './services/PaggueServices'
export * from './services/PaggueBaseService'
export * from './services/PaggueBillingOrderService'
export * from './services/PaggueCashOutService'

async function oneOff() {
  // const logger = new LogService('OneOff')
  //
  PaggueServices.init({
    companyId: '7114',
    clientKey: '7325077848134082112',
    clientSecret: '54748833224021937096815379',
    signatureToken: '51f1260d-f307-42ac-b66a-0cd48a784d3f',
    sandbox: false,
    debug: false
  })
  //
  // const paggueCashOutService = PaggueServices.get(PaggueCashOutService)
  //
  // const cashout = paggueCashOutService.createTransfer({
  //   externalId: randomUUID().toString(),
  //   type: PaggueCashoutTypes.BankAccount,
  //   amount: 100,
  //   description: 'node-sdk - testing',
  //   bankAccount: {
  //     agency: '1488',
  //     account: '16754',
  //     accountDigit: '1',
  //     accountType: 'cc',
  //     document: '',
  //     holder: 'Jimmy de Oliveira Bastos Lima',
  //     ispb: '00000000'
  //   }
  // })
  //
  // logger.info('Cashout', cashout)
  //
  const paggueBillingOrderService = PaggueServices.get(
    PaggueBillingOrderService
  )

  const payment = await paggueBillingOrderService.createStaticPayment({
    externalId: randomUUID().toString(),
    amount: 2500,
    description: 'New Payment',
    payerName: 'Jimmy de Oliveira Bastos Lima'
  })
  //
  // logger.info('Payment', payment)
}

oneOff()
