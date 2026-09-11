export class GetocodingJsonError extends Error {
  constructor(...params) {
    super(...params)
    this.name = "GetocodingJsonError"
  }
}