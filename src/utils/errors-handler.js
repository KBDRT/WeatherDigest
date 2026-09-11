export function handleErrors(preview, error) {
  const errorName = error.name;
  switch (errorName) {
    case "TimeoutError": 
      return preview + "Превышение таймаута.";
    case "HttpError":
      return preview + " API вернул следующий ответ Статус: ${error.status}. Текст: ${error.statusText}.";
    case "TypeError":
      return preview + " Проблемы с сетью.";
    case "JsonError":
      return preview + " Неверный JSON файл в ответе.";
    case "CityNotFound":
      return `Город не найден!`;
    case "WeatherNotFound":
      return `Погода не найдена!`;
    default:
      return preview + "Неизвестная ошибка.";
  }
}