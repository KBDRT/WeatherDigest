import fs from 'fs/promises';
import path from 'path';
import config from '../config/starting-parameters.js';
import { fileURLToPath } from 'url';

export async function saveReport(citiesWeather, days) {

  const serializedInfo = JSON.stringify(citiesWeather, null, 2);
  const fullPath = await getFolder();

  try {
    await fs.writeFile(fullPath, serializedInfo);
  }
  catch (error) {

  }

}

async function getFolder() {

  const currentPath = path.dirname(fileURLToPath(import.meta.url));
  const basePath = path.join(currentPath, '..', "..");

  const reportsPath = path.join(basePath, config.reportsFolder);
  const newReportPath = path.join(reportsPath, "test.json");

  try {
    await fs.mkdir(reportsPath, { recursive: true });
  }
  catch (error) {

  }

  return newReportPath;
}