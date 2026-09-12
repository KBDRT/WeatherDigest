import { CityWeather } from '../models/CityWeather.js';
import { DayWeather } from '../models/DayWeather.js';
import { saveReport } from '../storage/reports-saver.js';
import { getInfoFromReport } from '../storage/reports-reader.js';
import { getGeocodingAsync } from '../api/open-meteo-geocoding.js';
import { getWeatherAsync } from '../api/open-meteo-weather.js';
import { handleErrors } from '../utils/errors-handler.js';

export class WeatherCityWorker {

  constructor(city, days, useCache) {
    this.cityName = city;
    this.days = days;
    this.useCache = useCache;

    this.cityInfo = new CityWeather();
    this.cityInfo.city = this.cityName;
  }

  async start() {
    try {
      if (this.useCache && await getInfoFromReport(this.cityName, this.days)) {
        return;
      }

      const cityGeocoding = await getGeocodingAsync(this.cityName);
      if (cityGeocoding.success) {
        this.#fillCityInfo(cityGeocoding);
        const cityWeather = await getWeatherAsync(cityGeocoding.latitude, cityGeocoding.longitude, this.days);
        this.#fillCityWeather(cityWeather);

        await saveReport(this.cityInfo, this.days);
      }
    }
    catch (error) {
      const errorMessage = handleErrors("Ошибка API!", error);
      console.log(`${this.cityName}: ${errorMessage}`);
    }
  }

  #fillCityInfo(geocodingInfo) {
    this.cityInfo.country = geocodingInfo.country;
    this.cityInfo.latitude = geocodingInfo.latitude;
    this.cityInfo.longitude = geocodingInfo.longitude;
  }

  #fillCityWeather(weather) {
    for (let day of weather) {
      this.cityInfo.weather.push(
        new DayWeather(
          day.date, 
          day.max, 
          day.min, 
          day.sum
        ));
    }
  }
}
