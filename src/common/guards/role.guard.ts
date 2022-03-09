import { RoleEnum } from './../constants/role';
/**
 * 操作权限控制
 */

import { ApiException } from './../exceptions/api.exception';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Request,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiErrorCode } from '../exceptions/api.code.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler()); // 从控制器注解中得到的角色组信息
    if (!roles || roles.length === 0) return true;
    console.log(roles);

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) throw new ApiException(ApiErrorCode.NOT_LOGIN);

    if (roles.some((r) => r === Number(user.userRole))) return true;

    throw new ApiException(ApiErrorCode.NOT_HAVE_AUTH);
  }
}
