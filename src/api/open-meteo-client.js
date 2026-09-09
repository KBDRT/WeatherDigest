import config from '../config/starting-parameters.js';
import {getGeocodingURL, getWeatherURL} from '../utils/search-params-creator.js';

export async function getGeocodingAsync(city) {
  let cityInfo = 
  {
    name: city,
    country: "",
    latitude: 0,
    longitude: 0,
    founded: false
  }

  const url = getGeocodingURL(city);

  try
  {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(config.api.timeOut),
      method: "GET", 
      headers: { "Accept": "application/json" }
    });

    if (response.ok === true) {
      const data = await response.json();

      if (data.results && data.results.length > 0)
      {
        cityInfo.country = data.results[0].country;
        cityInfo.latitude = data.results[0].latitude;
        cityInfo.longitude = data.results[0].longitude;
        cityInfo.founded = true;
      }
    }
  }
  catch(error)
  {
    console.log("ПОКА ERROR CODING" + error);
  }

  return cityInfo;
}

export async function getWeatherAsync(latitude, longitude, days) {
  let info = []
  const url = getWeatherURL(latitude, longitude, days);

  try
  {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(config.api.timeOut),
      method: "GET", 
      headers: { "Accept": "application/json" }
    });

    if (response.ok === true) {
      const data = await response.json();
      let index = 0;
      for(let day of data.daily.time)
      {
        info.push(
        {
          date: day,
          max: data.daily["temperature_2m_max"][index],
          min: data.daily["temperature_2m_min"][index],
          sum: data.daily["precipitation_sum"][index]
        });
        index++;
      }
    }
  }
  catch(error)
  {
    console.log("ПОКА ERROR CODING" + error);
  }

  return info;
}