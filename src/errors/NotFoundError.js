export class NotFoundError extends Error {
  constructor(name, ...params) {
    super(...params);
    this.name = name;
  }
}