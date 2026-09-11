import config from '../config/starting-parameters.js';

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
  }
  catch (error) {
    console.log("ПОКА ERROR CODING " + error);
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
  if (data.results?.length > 0) {
    const city = data.results[0];
    return {
      country: city.country ?? '',
      latitude: city.latitude ?? 0,
      longitude: city.longitude ?? 0,
      found: true
    };
  }
  return {};
}

