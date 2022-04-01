import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class SessionStrategy extends PassportStrategy(
  Strategy,
  'applySession',
) {
  async validate(@Request() req): Promise<any> {
    console.log('当前用户', req.user);
    const { passport } = req.session;
    if (!passport?.user) {
      throw new UnauthorizedException();
    }
    const { id, username, role } = passport.user;
    return {
      id,
      username,
      role,
    };
  }
}
