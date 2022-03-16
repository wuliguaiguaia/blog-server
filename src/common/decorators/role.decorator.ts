import { RoleEnum } from './../constants/role';
import { SetMetadata } from '@nestjs/common';

/**
 * 定制用户角色元数据
 */
export const Roles = (roles: RoleEnum[]) => SetMetadata('roles', roles);
