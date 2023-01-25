/* eslint-disable prettier/prettier */
import { randomUUID } from 'crypto'
import { LogService } from './services/helpers/LogService'
import { PaggueBillingOrderService } from './services/sdk/PaggueBillingOrderService'
import { PaggueServices } from './services/sdk/PaggueServices'

export { PaggueBillingOrderService } from './services/sdk/PaggueBillingOrderService'
export { PaggueServices } from './services/sdk/PaggueServices'

async function oneOff() {
  const logger = new LogService('oneOff')
  
  PaggueServices.init({
    companyId: '7114',
    clientKey: '7325077848134082112',
    clientSecret: '54748833224021937096815379',
    webhookToken: '51f1260d-f307-42ac-b66a-0cd48a784d3f',
    sandbox: false
  })

  const paggueBillingOrderService = PaggueServices.get(
    PaggueBillingOrderService
  )

  const payment = await paggueBillingOrderService.createStaticPayment({
    externalId: randomUUID().toString(),
    amount: 2500,
    description: 'New Payment',
    payerName: 'Jimmy de Oliveira Bastos Lima'
  })

  logger.info('Payment', payment)
}

// oneOff()
