export function handleErrors(preview, error) {
  const errorName = error.name;
  switch (errorName) {
    case "TimeoutError": 
      return preview + "Превышение таймаута.";
    case "HttpError":
      return preview + " API вернул следующий ответ Статус: ${error.status}. Текст: ${error.statusText}.";
    case "TypeError":
      return preview + " Проблемы с сетью.";
    case "GetocodingJsonError":
      return preview + " Неверный JSON файл в ответе.";
    case "CityNoFoundError":
      return `Город не найден!`;
    default:
      return preview + "Неизвестная ошибка.";
  }
}