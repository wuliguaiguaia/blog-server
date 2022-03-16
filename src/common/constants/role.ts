/**
 * 用户角色映射
 */

export enum RoleEnum {
  NORMAL = 1,
  ADMIN = 2,
  SUPER = 3,
}

export const RoleMap = {
  [RoleEnum.NORMAL]: '普通用户',
  [RoleEnum.ADMIN]: '管理员',
  [RoleEnum.SUPER]: '超级管理员',
};

/**
 * 权限控制
 */
export const authConfig = {
  analysis: [RoleEnum.ADMIN, RoleEnum.SUPER],
  comment: [RoleEnum.SUPER],
  message: [RoleEnum.SUPER],
  user: [RoleEnum.SUPER],
  article: {
    add: [RoleEnum.ADMIN, RoleEnum.SUPER],
    edit: [RoleEnum.ADMIN, RoleEnum.SUPER],
    publish: [RoleEnum.SUPER],
    delete: [RoleEnum.SUPER],
  },
  category: {
    add: [RoleEnum.ADMIN, RoleEnum.SUPER],
    edit: [RoleEnum.SUPER],
    delete: [RoleEnum.SUPER],
  },
};
