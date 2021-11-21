/**
 * 操作权限控制
 */

import { ApiException } from './../exceptions/api.exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiErrorCode } from '../exceptions/api.code.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();

    const userInfo = request.session?.userInfo;
    if (!userInfo) throw new ApiException(ApiErrorCode.NOT_HAVE_AUTH);

    if (roles.some((r) => r === Number(userInfo.role))) return true;

    throw new ApiException(ApiErrorCode.NOT_HAVE_AUTH);
  }
}
