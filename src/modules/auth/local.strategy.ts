import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // Passport 将基于 validate() 方法的返回值构建一个user 对象，并将其作为属性附加到请求对象上。
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ username, password });
    console.log('1 守卫');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
