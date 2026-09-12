import { test } from 'node:test';
import { getGeocodingAsync } from '../src/api/open-meteo-geocoding.js';
import assert from 'node:assert';
import { NotFoundError } from '../src/errors/NotFoundError.js';
import { JsonError } from '../src/errors/JsonError.js';
import { getWeatherAsync } from '../src/api/open-meteo-weather.js';
import { HttpError } from '../src/errors/httpError.js';

// test('Успех: Геокодинг города получен, при правильном названии.', async () => {
//   const cityName = "Набережные Челны";

//   const expected = {
//     name: cityName,
//     country: "Россия",
//     latitude: 55.73718,
//     longitude: 52.41961,
//     success: true
//   };

//   assert.deepStrictEqual(await getGeocodingAsync(cityName), expected);
// });

test('Ошибка: Город не найден.', async () => {
  const cityName = "Нет такого города";

  await assert.rejects(
    () => getWeatherAsync(cityName, 10, 10, -1),
    ReferenceError
  );
});