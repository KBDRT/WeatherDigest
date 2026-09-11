import config from '../config/starting-parameters.js';
import { JsonError } from '../errors/JsonError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { handleErrors } from '../utils/errors-handler.js';

export async function getWeatherAsync(cityName, latitude, longitude, days) {
  let weatherInfo = {
    success: false,
    weather: []
  }
  const url = getWeatherURL(latitude, longitude, days);

  try {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(config.api.timeOut),
      method: "GET", 
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      weatherInfo.weather = await parseResult(response);
      weatherInfo.success = true;
    }
    else {
      throw new HttpError(response.status, response.statusText);
    }
  }
  catch (error) {
    const errorMessage = handleErrors("Ошибка API-WEATHER!", error);
    console.log(`${city}: ${errorMessage}`);
  }

  return weatherInfo;
}

function getWeatherURL(latitude, longitude, days) {
  const url = new URL(config.api.baseUrlWeather);
  url.searchParams.append("latitude", latitude);
  url.searchParams.append("longitude", longitude);
  url.searchParams.append("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum");
  url.searchParams.append("forecast_days", days);
  url.searchParams.append("timezone", "auto");

  return url;
}

async function parseResult(response) {
  let result = [];
  const data = await response.json();

  if (!data?.daily?.time) {
    throw new JsonError();
  }

  if (data.daily.time.length === 0) {
    throw new NotFoundError("WeatherNotFound");
  }

  let index = 0;
  for (let day of data.daily.time)
  {
    if (data.daily["temperature_2m_max"] && data.daily["temperature_2m_min"] && data.daily["precipitation_sum"]) {
      result.push(
      {
        date: day,
        max: data.daily["temperature_2m_max"][index],
        min: data.daily["temperature_2m_min"][index],
        sum: data.daily["precipitation_sum"][index]
      });
      index++;
    }
    else {
      throw new JsonError();
    }
  }
  return result;
}