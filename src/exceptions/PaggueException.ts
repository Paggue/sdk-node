export class PaggueException extends Error {
  constructor(
    public message: any,
    public status = 400,
    public previous?: Error
  ) {
    super(message)
  }
}
