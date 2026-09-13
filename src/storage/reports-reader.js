import { StorageError } from '../errors/StorageError.js';
import { getFilePath } from '../utils/directory-helper.js';
import fs from 'fs/promises';

export async function getInfoFromReport(city, days) {
  let result = {
    success: false,
    data: {},
  };
  try {
    const filePath = await getFilePath(city, days);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    if (fileContent.length > 0) {
      const parsedData = JSON.parse(fileContent);
      result.data = parsedData;
      result.success = true;
    }
  } catch (error) {}

  return result;
}
