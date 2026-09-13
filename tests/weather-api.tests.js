import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getWeatherAsync, parseResult } from '../src/api/open-meteo-weather.js';
import { HttpError } from '../src/errors/HttpError.js';
import { JsonError } from '../src/errors/JsonError.js';
import { NotFoundError } from '../src/errors/NotFoundError.js';

describe('Функция с отправкой запроса', () => {
  test('Погода получена, при валидных данных.', async () => {
    const latitude = 55.73718;
    const longitude = 52.41961;
    const days = 3;

    const result = await getWeatherAsync(latitude, longitude, days);

    assert.strictEqual(result.success, true);
    assert.ok(Array.isArray(result.weather));
    assert.strictEqual(result.weather.length, days);
  });

  test('Вызывается исключение HttpError (400) Bad request, если неправильные параметры переданы в запрос.', async () => {
    const lantitude = 10;
    const longtitude = 10;
    const days = -1;

    await assert.rejects(
      () => getWeatherAsync(lantitude, longtitude, days),
      HttpError
    );
  });
});

describe('Функция с обработкой результата', () => {
  test('Вызывается исключение JsonError, если пустой ответ.', async () => {
    const response = {
      json: async () => ({}),
    };

    await assert.rejects(() => parseResult(response), new JsonError());
  });

  test('Вызывается исключение JsonError, если нет всех полей в ответе.', async () => {
    const response = {
      json: async () => ({
        latitude: 55.73718,
        longitude: 52.41961,
        region: 'RU',
      }),
    };

    await assert.rejects(() => parseResult(response), new JsonError());
  });

  test('Вызывается исключение NotFoundError, если нет заполнено значение.', async () => {
    const response = {
      json: async () => ({
        daily: { time: [] },
      }),
    };

    await assert.rejects(
      () => parseResult(response),
      new NotFoundError('WeatherNotFound')
    );
  });

  test('Вызывается исключение JsonError, если нет всех полей в ответе (массиве).', async () => {
    const response = {
      json: async () => ({
        daily: { time: ['2026-09-12'], temperature_2m_max: 21 },
      }),
    };

    await assert.rejects(() => parseResult(response), new JsonError());
  });

  test('Успешный результат, если в запросе все необходимые данные.', async () => {
    const expected = [
      {
        date: '2026-09-12',
        maxTemperature: 21.2,
        minTemperature: 11.2,
        sumPrecipitation: 0.1,
      },
    ];

    const response = {
      json: async () => ({
        daily: {
          time: ['2026-09-12'],
          temperature_2m_max: [21.2],
          temperature_2m_min: [11.2],
          precipitation_sum: [0.1],
          m1: [10],
        },
      }),
    };

    assert.deepStrictEqual(await parseResult(response), expected);
  });
});
