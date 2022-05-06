import { RoleEnum } from './../constants/role';
import { SetMetadata } from '@nestjs/common';

/**
 * 定制用户角色元数据
 */
export const Roles = (roles: RoleEnum[]) => {
  return (target, key, descriptor) => {
    /*
      {
        value: [AsyncFunction: addCategory],
        writable: true,
        enumerable: false,
        configurable: true
      }
    */
    Reflect.defineMetadata('roles', roles, descriptor.value);
    // return descriptor;
  };
};

export const test = (data) => {};
