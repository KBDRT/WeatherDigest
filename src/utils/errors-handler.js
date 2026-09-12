export function handleErrors(preview, error) {
  const errorName = error.name;
  switch (errorName) {
    case "TimeoutError": 
      return preview + " Превышение таймаута.";
    case "HttpError":
      if (error.status >= 400 && error.status < 500) {
        return preview + ` Ошибка клиента. Статус: ${error.status}. Текст: ${error.statusText}.`;
      }
      else if (error.status >= 500 && error.status < 600) {
        return preview + ` Ошибка сервера. Статус: ${error.status}. Текст: ${error.statusText}.`;
      }
      return preview + ` API вернул следующий ответ Статус: ${error.status}. Текст: ${error.statusText}.`;
    case "TypeError":
      return preview + " Проблемы с сетью.";
    case "JsonError":
      return preview + " Неверный JSON файл в ответе.";
    case "CityNotFound":
      return `Город не найден!`;
    case "WeatherNotFound":
      return `Погода не найдена!`;
    case "StorageError":
      return ` ${error.message}`;
    default:
      return preview + " Неизвестная ошибка.";
  }
}