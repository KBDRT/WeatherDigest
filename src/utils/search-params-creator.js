import config from '../config/starting-parameters.js';

export function getGeocodingURL(city) {
  const url = new URL(config.api.baseUrlGeocoding);
  url.searchParams.append("name", city);
  url.searchParams.append("count", 1);
  url.searchParams.append("language", "ru");
  url.searchParams.append("format", "json");

  return url;
}

export function getWeatherURL(latitude, longitude, days) {
  const url = new URL(config.api.baseUrlWeather);
  url.searchParams.append("latitude", latitude);
  url.searchParams.append("longitude", longitude);
  url.searchParams.append("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum");
  url.searchParams.append("forecast_days", days);
  url.searchParams.append("timezone", "auto");

  return url;
}