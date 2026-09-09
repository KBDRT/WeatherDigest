import dotenv from 'dotenv';
dotenv.config();

export function validateEnvFile()
{
  let isSuccess = true
  const parametersName = ["PARAMETER_CITY_NAME", "PARAMETER_DAYS_NAME", "PARAMETER_DAYS_DEFAULT_VALUE", "PARAMETER_DAYS_MIN_VALUE", "PARAMETER_DAYS_MAX_VALUE"];
  const numberParametersName = ["PARAMETER_DAYS_DEFAULT_VALUE", "PARAMETER_DAYS_MIN_VALUE", "PARAMETER_DAYS_MAX_VALUE"];

  for(let parameterName of parametersName) {
    if (!process.env[parameterName]) {
      console.error(`Ошибка файла с переменными окружения (.env)! Не найден параметр: ${parameterName}`); 
      isSuccess = false;
    }
  }

  for(let parameterName of numberParametersName) {
    if (isNaN(parseInt(process.env[parameterName]))) {
      console.error(`Ошибка файла с переменными окружения (.env)! Параметр ${parameterName} не является числом!`); 
      isSuccess = false;
    }
  }

  if (!isSuccess)
    process.exit(1);
}
