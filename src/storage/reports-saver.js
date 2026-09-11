import fs from 'fs/promises';
import path from 'path';
import config from '../config/config-parameters.js';
import { fileURLToPath } from 'url';
import { getFolder } from '../utils/directory-helper.js';

export async function saveReport(citiesWeather, days) {

  const serializedInfo = JSON.stringify(citiesWeather, null, 2);

  try {
    const fullPath = await getFolder(citiesWeather.city, days, true);
    await fs.writeFile(fullPath, serializedInfo);
  }
  catch (error) {

  }

}

