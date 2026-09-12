import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/config-parameters.js';
import { getCurrentDate } from './date-helper.js';

export async function getFilePath(city, days, isCreateFolder) {

  const currentPath = path.dirname(fileURLToPath(import.meta.url));
  const basePath = path.join(currentPath, '..', "..");

  const reportsPath = path.join(basePath, config.reportsFolder);

  const fileName = getFileName(city, days);

  const newReportPath = path.join(reportsPath, fileName);

  if (isCreateFolder) {
    await fs.mkdir(reportsPath, { recursive: true });
  }

  return newReportPath;
}

function getFileName(city, days) {
  const date = getCurrentDate();

  const cityName = city.replace(/\s+/g, '').toUpperCase();

  return `${cityName}-${date}-${days}.json`;
}