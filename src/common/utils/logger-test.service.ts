import { WinstonLogger } from 'nest-winston';

export class MyLogger2 extends WinstonLogger {
  log(message: any, context?: string) {
    console.log(message);
    super.log(message, context);
  }
  info(message: any, context?: string) {
    console.log(message);
  }
  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
  }
  warn(message: any, context?: string) {
    super.warn(message, context);
  }
  debug?(message: any, context?: string) {
    super.debug(message, context);
  }
}
