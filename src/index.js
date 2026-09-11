import { parseParameters } from "./utils/parameters-parser.js";
import { WeatherCityWorker } from './services/WeatherCityWorker.js';

const inputParameters = parseParameters();

let tasks = [];
for (let city of inputParameters.cities) {
  const worker = new WeatherCityWorker(city, inputParameters.days, !inputParameters.nocache);
  tasks.push(worker.start());
}

await Promise.allSettled(tasks);

