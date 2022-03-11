/**
 * 用户角色映射
 */

export enum RoleEnum {
  NORMAL = 0,
  ADMIN = 1,
  SUPER = 2,
}

export const RoleMap = {
  [RoleEnum.SUPER]: '超级管理员',
  [RoleEnum.ADMIN]: '管理员',
  [RoleEnum.NORMAL]: '普通用户',
};
