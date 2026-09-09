import config from './config/starting-parameters.js';
import { parseParameters } from './utils/parameters-parser.js';

export async function Execute() {
  const inputParameters = parseParameters();

  let tasks = [];
  for (let city of inputParameters.cities) {
    tasks.push(GetWeatherForCity(city, inputParameters.days))
  }

  await Promise.allSettled(tasks);
}

async function GetWeatherForCity(city, days) {

}