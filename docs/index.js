const path = require('path');
const log4js = require('log4js');
const logger = log4js.getLogger();
const rootDir = path.join(__dirname, '..'); // 根目录
const logDir = path.join(rootDir, 'log'); // 日志目录
log4js.configure({
  appenders: {
    everything: {
      type: 'dateFile', // 按特定的日期模式滚动；
      filename: `${logDir}/server.log`,
      daysToKeep: 7,
      keepFileExt: true,
      layout: {
        type: 'pattern',
        pattern: '[%r] [%[%5.5p%]] - %m%n',
      },
    },
  },
  categories: {
    default: { appenders: ['everything'], level: 'debug' },
  },
});
logger.debug('Time:', new Date());
logger.info('Time:', new Date());
logger.error('Time:', new Date());
logger.warn('Time:', new Date());
logger.fatal('Time:', new Date());
logger.mark('Time:', new Date());
logger.off('Time:', new Date());
// https://zhuanlan.zhihu.com/p/22110802
