import config from '../config/starting-parameters.js';

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
  }
  catch (error) {
    console.log("ПОКА ERROR CODING " + error);
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
  let index = 0;
  for (let day of data.daily.time)
  {
    result.push(
    {
      date: day,
      max: data.daily["temperature_2m_max"][index],
      min: data.daily["temperature_2m_min"][index],
      sum: data.daily["precipitation_sum"][index]
    });
    index++;
  }
  return result;
}