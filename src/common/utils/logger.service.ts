import getContext from './getContext';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService, Injectable, Inject } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  constructor() {
    /** // @Inject(WINSTON_MODULE_NEST_PROVIDER)
     * WINSTON_MODULE_NEST_PROVIDER vs  WINSTON_MODULE_PROVIDER ？
     * https://www.npmjs.com/package/nest-winston
     * > WINSTON_MODULE_PROVIDER 配合 Logger from winston
     * > WINSTON_MODULE_NEST_PROVIDER 配合 LoggerService from @nestjs/common
     */
  }
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService;

  getFormatMessage(message, extra = '', context = 'LemonTree') {
    const req_context = getContext();
    return { context, ...req_context, message, extra };
  }
  log(message, extra?: any, context?: string) {
    this.logger.log(this.getFormatMessage(message, extra, context));
  }
  error(message, extra?: any, context?: string) {
    this.logger.error(this.getFormatMessage(message, extra, context));
  }
  warn(message, extra?: any, context?: string) {
    this.logger.warn(this.getFormatMessage(message, extra, context));
  }
}
