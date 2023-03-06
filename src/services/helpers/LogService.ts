import winston, { Logger } from 'winston'
import { PaggueServices } from '../PaggueServices'
import { ConfigService } from './ConfigService'

export class LogService {
  private configService: ConfigService = PaggueServices.get(ConfigService)

  private instance: Logger

  constructor(context?: string) {
    this.instance = winston.createLogger({
      transports: [new winston.transports.Console()],
      defaultMeta: { service: context },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
      )
    })
  }

  private log(
    type: string,
    message: string,
    meta?: any,
    callback?: FunctionConstructor
  ) {
    if (this.configService.get(['debug'])) {
      this.instance.log(type, message, { meta }, callback)
    }
  }

  error(message: string, meta?: any, callback?: FunctionConstructor) {
    this.log('error', message, { meta }, callback)
  }

  warn(message: string, meta?: any, callback?: FunctionConstructor) {
    this.log('warn', message, { meta }, callback)
  }

  info(message: string, meta?: any, callback?: FunctionConstructor) {
    this.log('info', message, { meta }, callback)
  }

  debug(message: string, meta?: any, callback?: FunctionConstructor) {
    this.log('debug', message, { meta }, callback)
  }
}
