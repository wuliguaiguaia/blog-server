import { clsMiddleware } from './common/middleware/cls.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectredis from 'connect-redis';
import * as passport from 'passport';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RolesGuard } from './common/guards/role.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.setGlobalPrefix('api/blog');
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ResponseInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );
  /* 对于混合应用程序，useGlobalGuards() 方法不会为网关和微服务设置守卫 ！！！ */
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  /**
   * redis 连接
   */
  const RedisStore = connectredis(session); // 为express提供session存储
  const redisClient = redis.createClient(
    config.redisServer.port,
    config.redisServer.host,
  );
  redisClient.on('error', (err) => {
    console.log('Could not establish a connection with redis. ' + err);
  });
  redisClient.on('connect', () => {
    console.log('Connected to redis successfully');
  });
  // 设置passport序列化和反序列化user的方法，在将用户信息存储到session时使用
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  // 反序列化
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'nest lemon test', // 用来对session id相关的cookie进行签名
      name: 'connect.sid', // 默认
      resave: false, // (是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存
      saveUninitialized: false, // 初始化session时是否保存到存储
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 2592000 * 1000, // 有效期，单位是毫秒
      },
    }),
  );
  // 设置passport，并启用session
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * 增加安全相关请求头
   *
   *  html: Content-Security-Policy（默认）: 「内容安全策略 http://www.ruanyifeng.com/blog/2016/09/csp.html」
   *   default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;
   *   frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';
   *   style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
   *
   *  Strict-Transport-Security: max-age=15552000; includeSubDomains
   *  X-Content-Type-Options: nosniff
   *  X-DNS-Prefetch-Control: off
   *  X-Download-Options: noopen
   *  X-Frame-Options: SAMEORIGIN
   *  X-Permitted-Cross-Domain-Policies: none
   *  X-XSS-Protection: 0
   */
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'default-src': [
          "'self'" /* 限制所有的外部资源，都只能从当前域名加载 */,
        ],
        'connect-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:'],
        'style-src-elem': ["'self'", 'data:'],
        'script-src': [
          "'unsafe-inline'" /* 允许执行页面内嵌的&lt;script>标签和事件监听函数 */,
          "'self'" /* 只能从当前域名加载 */,
        ],
        'object-src': ["'none'"] /* 禁止加载任何外部插件 */,
      },
    }),
  );

  /**
   * 绑定请求上下文
   */
  app.use(clsMiddleware);

  app.enableCors({
    origin: [/orangesolo\.cn$/],
    credentials: true,
  });
  // app.use(cookieParser());

  /**
   * 日志
   */
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // [winston] Unknown logger level: 231321

  // app.useStaticAssets(join(__dirname, '..', 'public')); /* 存储静态文件 */

  await app.listen(config.port);
}
bootstrap();
