import { describe, test } from 'node:test';
import { getGeocodingAsync, parseResult } from '../src/api/open-meteo-geocoding.js';
import assert from 'node:assert';
import { NotFoundError } from '../src/errors/NotFoundError.js';
import { JsonError } from '../src/errors/JsonError.js';

describe('Функция с отправкой запроса', () => {
  test('Геокодинг получен при валидном городе.', async () => {
    const cityName = "Набережные Челны";

    const expected = {
      name: cityName,
      country: "Россия",
      latitude: 55.73718,
      longitude: 52.41961,
      success: true
    };

    assert.deepStrictEqual(await getGeocodingAsync(cityName), expected);
  });

  test('Вызывается исключение, если город не найден.', async () => {
    const cityName = "Нет такого города";

    await assert.rejects(
      () => getGeocodingAsync(cityName),
      new NotFoundError("CityNotFound")
    );
  });
});

describe('Функция с обработкой результата', () => {
  test('Вызывается исключение JsonError, если нет всех полей в ответе.', async () => {
    const response = {
      json: async () => ({
        results: [
          { latitude: 55.75, longitude: 37.62 }
        ]
      })
    };

    await assert.rejects(
      () => parseResult(response),
      new JsonError()
    );
  });

  test('Вызывается исключение NotFoundError, если результат пустой.', async () => {
    const response = {
      json: async () => ({
        results: [
        ]
      })
    };

    await assert.rejects(
      () => parseResult(response),
      new NotFoundError("CityNotFound")
    );
  });

  test('Возвращается правильный объект со всеми полями, если валидный ответ.', async () => {
    const expected = {
      country: "Россия",
      latitude: 55.73718,
      longitude: 52.41961,
      success: true
    };

    const response = {
      json: async () => ({
        results: [
          { country: 'Россия', latitude: 55.73718, longitude: 52.41961, region: "RU" }
        ]
      })
    };

    assert.deepStrictEqual(await parseResult(response), expected);
  });

  test('Вызывается исключение NotFoundError, если ответ пустой полностью.', async () => {
    const response = {
      json: async () => ({
        
      })
    };

    await assert.rejects(
      () => parseResult(response),
      new NotFoundError("CityNotFound")
    );
  });

});


