export class StorageError extends Error {
  constructor(source, message, ...params) {
    super(...params);
    this.name = 'StorageError';
    this.source = source;
    this.message = message;
  }
}
