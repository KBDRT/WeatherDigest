import config from '../config/starting-parameters.js';
import { HttpError } from '../errors/httpError.js';
import { JsonError } from '../errors/JsonError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getGeocodingAsync(city) {
  let cityInfo = {
    name: city,
    country: "",
    latitude: 0,
    longitude: 0,
    success: false,
  }

  const url = getGeocodingURL(city);

  const response = await fetch(url, { 
    signal: AbortSignal.timeout(config.api.timeOut),
    method: "GET", 
    headers: { "Accept": "application/json" }
  });

  if (response.ok) {
    const parsedData = await parseResult(response);
    cityInfo = { ...cityInfo, ...parsedData };
  }
  else {
    throw new HttpError(response.status, response.statusText);
  }

  return cityInfo;
}

function getGeocodingURL(city) {
  const url = new URL(config.api.baseUrlGeocoding);
  url.searchParams.append("name", city);
  url.searchParams.append("count", 1);
  url.searchParams.append("language", "ru");
  url.searchParams.append("format", "json");

  return url;
}

async function parseResult(response) {
  const data = await response.json();
  
  if (!data.results || !data.results.length) {
    throw new NotFoundError("CityNotFound");
  }

  const city = data.results[0];
  if (city.country && city.latitude && city.longitude) {
    return {
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      success: true
    };
  }
  else {
    throw new JsonError();
  }
}

