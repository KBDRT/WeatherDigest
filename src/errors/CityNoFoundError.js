export class CityNoFoundError extends Error {
  constructor(...params) {
    super(...params)
    this.name = "GetocodingJsonError"
  }
}