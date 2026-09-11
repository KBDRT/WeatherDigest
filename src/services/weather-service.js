import { getGeocodingAsync, getWeatherAsync } from '../api/open-meteo-client.js';
import { CityWeather } from '../models/CityWeather.js';
import { parseParameters } from '../utils/parameters-parser.js';
import { DayWeather } from '../models/DayWeather.js';
import { saveReport } from '../storage/reports-saver.js';
import { getInfoFromReport } from '../storage/reports-reader.js';

export async function execute() {
  const inputParameters = parseParameters();

  let tasks = [];
  for (let city of inputParameters.cities) {
    tasks.push(getWeatherForCity(city, inputParameters.days, !inputParameters.nocache))
  }

  await Promise.allSettled(tasks);
}

async function getWeatherForCity(city, days, useCache) {
  const cityInfo = new CityWeather();
  cityInfo.city = city;

  if (useCache && await getInfoFromReport(city, days)) {
    return;
  }

  const cityGeocoding = await getGeocodingAsync(city);

  if (cityGeocoding.founded) {
    fillCityInfo(cityInfo, cityGeocoding);
    const cityWeather = await getWeatherAsync(cityGeocoding.latitude, cityGeocoding.longitude, days);
    fillCityWeather(cityInfo, cityWeather);
    await saveReport(cityInfo, days);

    console.log(cityInfo);
  }
  else {
    // console.log(`Город ${city} не найден!`);
  }

}

function fillCityInfo(city, geocodingInfo) {
  city.country = geocodingInfo.country;
  city.latitude = geocodingInfo.latitude;
  city.longitude = geocodingInfo.longitude;
}

function fillCityWeather(city, weather) {
  for (let day of weather) {
    city.weather.push(
      new DayWeather(
        day.date, 
        day.max, 
        day.min, 
        day.sum
      ));
  }
}