import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { promisify } from 'util';
import { ApiException } from 'src/common/exceptions/api.exception';
import { ApiErrorCode } from 'src/common/exceptions/api.code.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true });
  }

  // Passport 将基于 validate() 方法的返回值构建一个user 对象，并将其作为属性附加到请求对象上。
  async validate(
    @Request() req,
    username: string,
    password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new ApiException(
        ApiErrorCode.TABLE_OPERATE_ERROR,
        '用户名或密码错误',
      );
    }
    // 用户名密码匹配，设置session
    // promisify，统一代码风格，将node式callback转化为promise
    await promisify(req.login.bind(req))(user);
    return user;
  }
}
