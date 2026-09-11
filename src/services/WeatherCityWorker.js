import { CityWeather } from '../models/CityWeather.js';
import { DayWeather } from '../models/DayWeather.js';
import { saveReport } from '../storage/reports-saver.js';
import { getInfoFromReport } from '../storage/reports-reader.js';
import { getGeocodingAsync } from '../api/open-meteo-geocoding.js';
import { getWeatherAsync } from '../api/open-meteo-weather.js';
import { Printer } from './../format/Printer.js';

export class WeatherCityWorker {
  constructor(city, days, useCache) {
    this.cityName = city;
    this.days = days;
    this.useCache = useCache;

    this.cityInfo = new CityWeather();
    this.cityInfo.city = this.cityName;
  }

  async start() {
    if (this.useCache && await getInfoFromReport(this.cityName, this.days)) {
      return;
    }

    const cityGeocoding = await getGeocodingAsync(this.cityName);
    if (cityGeocoding.success) {
      const cityWeather = await getWeatherAsync(this.cityName, cityGeocoding.latitude, cityGeocoding.longitude, this.days);
      if (cityWeather.success) {
        this.#fillCityInfo(cityGeocoding);
        this.#fillCityWeather(cityWeather.weather);

        await saveReport(this.cityInfo, this.days);

        const printer = new Printer(this.cityInfo);
        printer.display();
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
          day.max, 
          day.min, 
          day.sum
        ));
    }
  }
}
