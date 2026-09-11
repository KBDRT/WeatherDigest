export class WeatherNotFoundError extends Error {
  constructor(...params) {
    super(...params)
    this.name = "WeatherNotFoundError"
  }
}