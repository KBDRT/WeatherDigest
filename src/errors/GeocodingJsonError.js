export class GetocodingJsonError extends Error {
  constructor(apiName, ...params) {
    super(...params)
    this.name = apiName
  }
}