import { CityWeather } from '../models/CityWeather.js';
import { DayWeather } from '../models/DayWeather.js';
import { saveReport } from '../storage/reports-saver.js';
import { getInfoFromReport } from '../storage/reports-reader.js';
import { getGeocodingAsync } from '../api/open-meteo-geocoding.js';
import { getWeatherAsync } from '../api/open-meteo-weather.js';
import { Printer } from './../format/Printer.js';
import { handleErrors } from '../utils/errors-handler.js';

export class WeatherCityWorker {
  #success = false;
  constructor(city, days, useCache) {
    this.cityName = city;
    this.days = days;
    this.useCache = useCache;

    this.cityInfo = new CityWeather();
    this.cityInfo.city = this.cityName;
  }

  async start() {
    try {
      if (this.useCache)  {
        await this.#getFromCache();
      } 
      else {
        await this.#getFromAPI();
      }

      if (this.#success) {
        const printer = new Printer(this.cityInfo);
        printer.display();
      }
    }
    catch (error) {
      const errorMessage = handleErrors(error);
      console.log(`${this.cityName}: ${errorMessage}`);
    }
  }

  async #getFromCache() {
    const cacheResult = await getInfoFromReport(this.cityName, this.days);
    if (cacheResult.success) {
      this.#fillCityInfo(cacheResult.data);
      this.#fillCityWeather(cacheResult.data.weather);
      this.#success = true;
    } 
    else {
      await this.#getFromAPI();
    }
  }

  async #getFromAPI() {
    const cityGeocoding = await getGeocodingAsync(this.cityName);
    if (cityGeocoding.success) {
      const cityWeather = await getWeatherAsync(cityGeocoding.latitude, cityGeocoding.longitude, this.days);
      if (cityWeather.success) {
        this.#fillCityInfo(cityGeocoding);
        this.#fillCityWeather(cityWeather.weather);
        await saveReport(this.cityInfo, this.days);
        this.#success = true;
      }
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
          day.maxTemperature, 
          day.minTemperature, 
          day.sumPrecipitation
        ));
    }
  }
}
