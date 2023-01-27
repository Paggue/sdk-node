export class PaggueException extends Error {
  constructor(public message: any, public status = 400, public error?: Error) {
    super(message)
  }
}
