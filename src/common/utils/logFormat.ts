/**
 * 自定义日志格式
 */

import * as config from 'config';
import * as winston from 'winston';

export default winston.format.printf((info) => {
  console.log(info);
  return `[${config.log.prefix}] ${info.timestamp}:${info.label || 'default'}:${
    info.message
  }`;
});
