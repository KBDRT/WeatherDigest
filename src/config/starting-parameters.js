import dotenv from 'dotenv';
dotenv.config({quiet: true});

import { validateEnvFile } from './validator.js';

validateEnvFile();

const config = {
  city: {
    parameterName: process.env.PARAMETER_CITY_NAME
  },
  days: {
    parameterName: process.env.PARAMETER_DAYS_NAME,
    defaultValue: parseInt(process.env.PARAMETER_DAYS_DEFAULT_VALUE),
    minValue: parseInt(process.env.PARAMETER_DAYS_MIN_VALUE),
    maxValue: parseInt(process.env.PARAMETER_DAYS_MAX_VALUE)
  }
};

export default config;