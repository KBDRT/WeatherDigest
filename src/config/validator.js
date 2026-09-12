export function validateEnvFile() {
  let isSuccess = validateNames() & validateNumbers();
  
  if (!isSuccess)
    process.exit(1);
}

function validateNames() {
  let isSuccess = true;
  const parametersName = [
    "PARAMETER_CITY_NAME", 
    "PARAMETER_DAYS_NAME", 
    "PARAMETER_DAYS_DEFAULT_VALUE", 
    "PARAMETER_DAYS_MIN_VALUE", 
    "PARAMETER_DAYS_MAX_VALUE",
    "PARAMETER_NOCACHE_NAME",
    "BASE_URL_GEOCODING",
    "BASE_URL_WEATHER",
    "API_TIMEOUT",
    "REPORTS_FOLDER",

  ];

  for (let parameterName of parametersName) {
    if (!process.env[parameterName]) {
      console.error(`Ошибка файла с переменными окружения (.env)! Параметр: ${parameterName} не найден!`); 
      isSuccess = false;
    }
  }

  return isSuccess;
}

function validateNumbers() {
  let isSuccess = true;
  const numberParametersName = [
    "PARAMETER_DAYS_DEFAULT_VALUE", 
    "PARAMETER_DAYS_MIN_VALUE", 
    "PARAMETER_DAYS_MAX_VALUE",
    "API_TIMEOUT"
  ];

  for (let parameterName of numberParametersName) {
    if (isNaN(parseInt(process.env[parameterName]))) {
      console.error(`Ошибка файла с переменными окружения (.env)! Параметр: ${parameterName} не является числом!`); 
      isSuccess = false;
    }
  }
  return isSuccess;
}