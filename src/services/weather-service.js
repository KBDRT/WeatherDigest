import { getGeocodingAsync, getWeatherAsync } from '../api/open-meteo-client.js';
import { parseParameters } from '../utils/parameters-parser.js';

export async function execute() {
  const inputParameters = parseParameters();

  let tasks = [];
  for (let city of inputParameters.cities) {
    tasks.push(getWeatherForCity(city, inputParameters.days))
  }

  await Promise.allSettled(tasks);
}

async function getWeatherForCity(city, days) {
  let info = {
    city: {},
    weather: {}
  }
  const cityGeocoding = await getGeocodingAsync(city);

  if (cityGeocoding.founded) {
    info.city = cityGeocoding;
    const cityWeather = await getWeatherAsync(cityGeocoding.latitude, cityGeocoding.longitude, days);
    info.weather = cityWeather;
  }
  else {
    // console.log(`Город ${city} не найден!`);
  }

  console.log(info);
  return info;
}