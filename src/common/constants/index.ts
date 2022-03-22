import * as winston from 'winston';

export const saltOrRounds = 12;

export const logDefaultOptions = {
  datePattern: 'YYYY-MM-DD',
  json: true,
  format: winston.format.combine(winston.format.prettyPrint()),
  maxSize: '20m',
  maxFiles: '14d',
};
