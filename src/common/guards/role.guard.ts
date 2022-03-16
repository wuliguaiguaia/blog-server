import { ApiException } from './../exceptions/api.exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiErrorCode } from '../exceptions/api.code.enum';

/**
 * 操作权限控制
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler()); // 从控制器注解中得到的角色组信息

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.session.passport.user;

    if (!user) throw new ApiException(ApiErrorCode.NOT_LOGIN);

    if (roles.some((r) => r === Number(user.role))) return true;

    throw new ApiException(ApiErrorCode.NOT_HAVE_AUTH);
  }
}
