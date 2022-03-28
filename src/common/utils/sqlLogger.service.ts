import { logDefaultOptions } from './../constants/index';
import { Logger, QueryRunner } from 'typeorm';
import { createLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as config from 'config';
import * as winston from 'winston';
import * as path from 'path';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import getContext from './base-logger';
/* 
 记录 sql log
 包括慢查询
*/
export class SqlLogger implements Logger {
  logger: any;
  constructor() {
    this.logger = createLogger({
      level: 'info',
      exitOnError: false,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        nestWinstonModuleUtilities.format.nestLike('柠檬树下你和我'),
      ),
      transports: [
        new DailyRotateFile({
          filename: path.join(
            process.cwd(),
            config.logs,
            'access-sql-%DATE%.log',
          ),

          level: 'info',
          ...logDefaultOptions,
        }),
        process.env.NODE_ENV !== 'production' &&
          new winston.transports.Console(),
      ].filter(Boolean),
    });
  }
  getFormatMessage({
    query,
    parameters,
    error,
    time,
  }: {
    query: any;
    parameters?: any;
    error?: string | Error;
    time?: number;
  }) {
    const req_context = getContext();
    if (!req_context.logId) return;
    const { logId, url } = req_context;
    return {
      logId,
      url,
      query,
      parameters,
      error,
      time,
    };
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const req_context = getContext();
    if (!req_context.logId) return;
    this.logger.info(this.getFormatMessage({ query, parameters }));
  }
  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error(this.getFormatMessage({ error, query, parameters }));
  }
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(this.getFormatMessage({ time, query, parameters }));
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message);
  }
  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message);
  }
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    // this.logger.info(level, message);
    console.log(level, message);
  }
}
