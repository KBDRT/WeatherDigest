import { getGeocodingAsync, getWeatherAsync } from './api/open-meteo-client.js';
import config from './config/starting-parameters.js';

console.log("START");

let info = await getGeocodingAsync("Москва");

if (info.founded) {
  console.log(info);
  let weather = await getWeatherAsync(info.latitude, info.longitude, config.days.defaultValue);
  console.log(weather);
}