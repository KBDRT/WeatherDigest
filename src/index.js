import config from './config/starting-parameters.js';
import { validateEnvFile } from './config/validator.js';

validateEnvFile();

console.log("START");

const args = process.argv.slice(2);

console.log(config);