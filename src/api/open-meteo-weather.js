import config from '../config/starting-parameters.js';
import { GetocodingJsonError } from '../errors/GeocodingJsonError.js';
import { WeatherNotFoundError } from '../errors/WeatherNotFoundError.js';
import { handleErrors } from '../utils/errors-handler.js';

export async function getWeatherAsync(latitude, longitude, days) {
  let weatherInfo = []
  const url = getWeatherURL(latitude, longitude, days);

  try {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(config.api.timeOut),
      method: "GET", 
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      weatherInfo = await parseResult(response);
    }
    else {
      throw new HttpError(response.status, response.statusText);
    }
  }
  catch (error) {
    const errorMessage = handleErrors("Ошибка API-WEATHER!", error);
    console.log(`${errorMessage}`);
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

  if (!data.daily.time.length) {
    throw new GetocodingJsonError("WeatherAPIJsonError");
  }

  let index = 0;

  if (!data.daily.time.length) {
    throw new WeatherNotFoundError();
  }

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
      throw new GetocodingJsonError("WeatherAPIJsonError");
    }
  }
  return result;
}