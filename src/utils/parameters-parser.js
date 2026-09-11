import config from '../config/starting-parameters.js';

const CITIES_SEPARATOR = ","

export function parseParameters() {
  let parameters = {
    days: config.days.defaultValue,
    cities: [],
    nocache: false,
  }

  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index++) {
    const parameter = args[index];
    
    const parsingDaysResult = parseDays(parameter, args[index + 1]);
    if (parsingDaysResult.success) {
      parameters.days = parsingDaysResult.value;
      continue;
    }

    const parsingCitiesResult = parseCities(parameter, args[index + 1]);
    if (parsingCitiesResult.success) {
      parameters.cities = parsingCitiesResult.value;
      continue;
    }

    if (!parameters.nocache) {
      parameters.nocache = parseNoCache(parameter);
    }
  }

  if (parameters.cities.length == 0) { 
    const parameterName = `${config.city["parameterName"]}`
    console.error(`Ошибка! Для параметра ${parameterName} не указано значение!`);
    process.exit(1);
  } 

  return parameters;
}

function parseDays(currentParameter, nextParameter) {
  let result = {
    success: false,
    value: -1
  }
  const parameterName = `${config.days["parameterName"]}`
  if (currentParameter === parameterName) {
    if (nextParameter) {
      const convertedValue = parseInt(nextParameter, 10);
      if (isNaN(convertedValue) || convertedValue < config.days.minValue || convertedValue > config.days.maxValue || !Number.isInteger(Number(nextParameter)) ) {
        console.error(`Ошибка! Параметр ${parameterName} должен быть целым числом в диапазоне от ${config.days.minValue} до ${config.days.maxValue} включительно.`);
        process.exit(1);
      }
      else {
        result.success = true;
        result.value = convertedValue;
      }
    }
    else {
      console.error(`Ошибка! Для параметра ${parameterName} не указано значение!`);
      process.exit(1);
    }
  }
  return result;
}

function parseCities(currentParameter, nextParameter) {
   let result = {
    success: false,
    value: []
  }
  const parameterName = `${config.city["parameterName"]}`
  if (currentParameter === parameterName) {
    if (nextParameter) {
      if (nextParameter.indexOf(CITIES_SEPARATOR) != -1) {
        result.value = nextParameter.split(CITIES_SEPARATOR);
      }
      else {
        result.value.push(nextParameter);
      }
      result.success = true;
    }
  }
  return result;
}

function parseNoCache(currentParameter) {
  const parameterName = `${config.noCache["parameterName"]}`
  if (currentParameter === parameterName) {
    return true;
  }
  return false;
};