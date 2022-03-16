import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class SessionStrategy extends PassportStrategy(
  Strategy,
  'applySession',
) {
  async validate(@Request() req): Promise<any> {
    // 注意passport的session数据结构，使用req.session.passport.user来访问 user session
    // console.log(req.session);
    const { passport } = req.session;

    console.log(passport, '[[');

    if (!passport?.user) {
      throw new UnauthorizedException();
    }
    // 这里的userId和username是上面local.strategy在调用login()函数的时候，passport添加到session中的。
    // 数据结构保持一致即可
    const { id, username, role } = passport.user;
    return {
      id,
      username,
      role,
    };
  }
}
