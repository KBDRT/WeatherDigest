export class JsonError extends Error {
  constructor(...params) {
    super(...params)
    this.name = "JsonError"
  }
}