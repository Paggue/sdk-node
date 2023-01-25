import winston, { Logger } from 'winston'

export class LogService {
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

  error(message: string, meta?: any, callback?: FunctionConstructor) {
    this.instance.log('error', message, { meta }, callback)
  }

  warn(message: string, meta?: any, callback?: FunctionConstructor) {
    this.instance.log('warn', message, { meta }, callback)
  }

  info(message: string, meta?: any, callback?: FunctionConstructor) {
    this.instance.log('info', message, { meta }, callback)
  }

  debug(message: string, meta?: any, callback?: FunctionConstructor) {
    this.instance.log('debug', message, { meta }, callback)
  }
}
