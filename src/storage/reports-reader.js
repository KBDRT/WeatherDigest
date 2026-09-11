import { getFolder } from "../utils/directory-helper.js";
import fs from 'fs/promises';

export async function getInfoFromReport(city, days) {
  let result = false;
  try {
    const path = await getFolder(city, days);
    const fileContent = await fs.readFile(path, 'utf-8');

    const data = JSON.parse(fileContent)
    console.log(data);
    result = true;
  }
  catch (error) {

  }

  return result;
}