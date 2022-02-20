import { MessageModule } from './modules/message/message.module';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ArticleModule } from './modules/article/article.module';
import { CommitModule } from './modules/commit/commit.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from './modules/auth/auth.module';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as config from 'config';
import * as path from 'path';
import * as winston from 'winston';
@Global() // 全局模块
@Module({
  imports: [
    /**
     * 数据库连接配置
     */
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: config.get('db.host'),
        port: Number(config.get('db.port')),
        username: config.get('db.username'),
        password: config.get('db.password'),
        database: config.get('db.database'),
        timezone: 'UTC',
        charset: 'utf8mb4',
        entities: ['dist/**/*.entity{.ts,.js}'],
        // 生产和测试环境中要设置成 false， 防止字段改动导致内容丢失，本地开发可以设置成 true
        synchronize: config.get('db.synchronize'), // true: 每次运行应用程序时实体都将与数据库同步
        // logging: config.get('db.logging'),
        logging: true,
        logger: 'file',
      }),
    }),

    /**
     * 日志模块
     */
    WinstonModule.forRoot({
      level: 'info',
      exitOnError: false,
      format: winston.format.combine(
        winston.format.timestamp({ format: new Date().toLocaleString() }),
        nestWinstonModuleUtilities.format.nestLike('柠檬树下你和我'),
      ),
      transports: [
        new DailyRotateFile({
          filename: path.join(
            __dirname,
            '..',
            config.logs,
            'access-%DATE%.log',
          ),
          datePattern: 'YYYY-MM-DD',
          json: true,
          level: 'info',
          format: winston.format.combine(winston.format.prettyPrint()),
        }),
        new DailyRotateFile({
          filename: path.join(
            __dirname,
            '..',
            config.logs,
            'access-wf-%DATE%.log',
          ),
          datePattern: 'YYYY-MM-DD',
          json: false,
          level: 'error',
          format: winston.format.combine(winston.format.prettyPrint()),
        }),
        // 保留标准输出
        new winston.transports.Console(),
      ],
    }),
    UserModule,
    ArticleModule,
    CategoryModule,
    CommitModule,
    AuthModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('');
    // 支持 path、method: { path: 'cats', method: RequestMethod.GET }
  }
}
