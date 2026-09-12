import fs from 'fs/promises';
import { getFilePath } from '../utils/directory-helper.js';

export async function saveReport(citiesWeather, days) {
  const serializedInfo = JSON.stringify(citiesWeather, null, 2);
  try {
    const fullPath = await getFilePath(citiesWeather.city, days, true);
    await fs.writeFile(fullPath, serializedInfo);
  }
  catch (error) {

  }
}

