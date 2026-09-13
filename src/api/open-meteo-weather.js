import config from '../config/config-parameters.js';
import { JsonError } from '../errors/JsonError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { HttpError } from './../errors/HttpError.js';

export async function getWeatherAsync(latitude, longitude, days) {
  let weatherInfo = {
    success: false,
    weather: [],
  };
  const url = getWeatherURL(latitude, longitude, days);

  const response = await fetch(url, {
    signal: AbortSignal.timeout(config.api.timeOut),
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (response.ok) {
    weatherInfo.weather = await parseResult(response);
    weatherInfo.success = true;
  } else {
    const data = await response.json();
    const reason = data.reason ?? 'Неизвестная причина';
    throw new HttpError(response.status, response.statusText, reason);
  }

  return weatherInfo;
}

function getWeatherURL(latitude, longitude, days) {
  const url = new URL(config.api.baseUrlWeather);
  url.searchParams.append('latitude', latitude);
  url.searchParams.append('longitude', longitude);
  url.searchParams.append(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_sum'
  );
  url.searchParams.append('forecast_days', days);
  url.searchParams.append('timezone', 'auto');

  return url;
}

export async function parseResult(response) {
  let result = [];
  const data = await response.json();

  if (!data?.daily?.time) {
    throw new JsonError();
  }

  if (data.daily.time.length === 0) {
    throw new NotFoundError('WeatherNotFound');
  }

  let index = 0;
  for (let day of data.daily.time) {
    if (
      data.daily['temperature_2m_max'] &&
      data.daily['temperature_2m_min'] &&
      data.daily['precipitation_sum']
    ) {
      result.push({
        date: day,
        maxTemperature: data.daily['temperature_2m_max'][index],
        minTemperature: data.daily['temperature_2m_min'][index],
        sumPrecipitation: data.daily['precipitation_sum'][index],
      });
      index++;
    } else {
      throw new JsonError();
    }
  }
  return result;
}
