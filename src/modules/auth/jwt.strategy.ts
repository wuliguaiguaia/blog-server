import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req, Request } from '@nestjs/common';
import * as config from 'config';
// 在每个请求时拿到 jwt

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 从请求中提取 JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 如果JWT过期，请求将被拒绝，并发送 401 未经授权的响应
      ignoreExpiration: false,
      // 提供对称的秘钥来签署令牌
      secretOrKey: config.jwtSecret,
    });
  }

  // Passport 首先验证 JWT 的签名并解码 JSON
  // 然后调用我们的 validate() 方法，该方法将解码后的 JSON 作为其单个参数传递
  async validate(payload: any) {
    console.log(`JWT验证 - Step 4: 被守卫调用`);
    return {
      userId: payload.sub,
      username: payload.username,
      userRole: payload.userRole,
    };
  }
}
