/**
 * 定制用户角色元数据
 */

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: number[]) => SetMetadata('roles', roles);
