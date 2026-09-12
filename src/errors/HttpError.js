export class HttpError extends Error {
  constructor(status, text, ...params) {
    super(...params);
    this.name = "HttpError";
    this.status = status;
    this.statusText = text;
  }
}