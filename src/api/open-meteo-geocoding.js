import config from '../config/starting-parameters.js';
import { CityNoFoundError } from '../errors/CityNoFoundError.js';
import { GetocodingJsonError } from '../errors/GeocodingJsonError.js';
import { HttpError } from '../errors/httpError.js';
import { handleErrors } from '../utils/errors-handler.js';

export async function getGeocodingAsync(city) {
  let cityInfo = {
    name: city,
    country: "",
    latitude: 0,
    longitude: 0,
    found: false
  }

  const url = getGeocodingURL(city);

  try {
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
  }
  catch (error) {
    const errorMessage = handleErrors("Ошибка API-GEOCODING!", error);
    console.log(`${city}: ${errorMessage}`);
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
  if (data.results.length < 0) {
    throw new CityNoFoundError();
  }
  
  const city = data.results[0];
  if (city.country && city.latitude && city.longitude) {
    return {
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      found: true
    };
  }
  else {
    throw new GetocodingJsonError();
  }
}

