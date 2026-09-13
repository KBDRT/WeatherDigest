export class HttpError extends Error {
  constructor(status, text, reason, ...params) {
    super(...params);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = text;
    this.reason = reason;
  }
}
