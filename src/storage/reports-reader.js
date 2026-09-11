import { getFolder } from "../utils/directory-helper.js";
import fs from 'fs/promises';

export async function isReportSaved(city, days) {
  let result = false;

  try {
    const path = getFolder(city, days);

    if (path.lenth > 0) {
      await fs.access(filePath);
      result = true;
    }

  }
  catch (error) {

  }

  return result;
}


export async function getInfoFromReport(city, days) {
  
}