/**
 * 用户角色映射
 */

export enum RoleEnum {
  NORMAL = 2,
  ADMIN = 1,
  SUPER = 0,
}

export const RoleMap = {
  [RoleEnum.SUPER]: '超级管理员',
  [RoleEnum.ADMIN]: '管理员',
  [RoleEnum.NORMAL]: '普通用户',
};
