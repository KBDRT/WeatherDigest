export function handleErrors(error) {
  const errorName = error.name;
  const source = error.source ?? '';
  switch (errorName) {
    case 'TimeoutError':
      return source + ' Превышение таймаута.';
    case 'HttpError':
      if (error.status >= 400 && error.status < 500) {
        return (
          source +
          ` Ошибка клиента. Статус: ${error.status}. Текст: ${error.statusText}. Причина: ${error.reason}`
        );
      } else if (error.status >= 500 && error.status < 600) {
        return (
          source +
          ` Ошибка сервера. Статус: ${error.status}. Текст: ${error.statusText}. Причина: ${error.reason}`
        );
      }
      return (
        source +
        ` API вернул следующий ответ Статус: ${error.status}. Текст: ${error.statusText}.`
      );
    case 'TypeError':
      if (error.message === 'fetch failed'){
        return source + ' Проблемы с сетью.';
      }
      return 'Ошибка с типом';
    case 'JsonError':
      return source + ' Неверный JSON файл в ответе.';
    case 'CityNotFound':
      return `Город не найден!`;
    case 'WeatherNotFound':
      return `Погода не найдена!`;
    case 'StorageError':
      return ` ${error.message}`;
    default:
      return source + ' Неизвестная ошибка.';
  }
}
