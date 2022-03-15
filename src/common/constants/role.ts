/**
 * 用户角色映射
 */

export enum RoleEnum {
  NORMAL = 1,
  ADMIN = 2,
  SUPER = 3,
}

export const RoleMap = {
  [RoleEnum.SUPER]: '超级管理员',
  [RoleEnum.ADMIN]: '管理员',
  [RoleEnum.NORMAL]: '普通用户',
};

/**
 * 权限控制
 */
export const authConfig = [
  /* 未登录 */
  {},
  /* role 1 */
  {},
  /* role 2 */
  {
    analysis: true,
    article: {
      add: true,
      edit: true,
    },
    category: {
      add: true,
    },
  },
  /* role 3 */
  {
    analysis: true,
    comment: true,
    message: true,
    user: true,
    article: {
      add: true,
      edit: true,
      publish: true,
      delete: true,
    },
    category: {
      add: true,
      edit: true,
      delete: true,
    },
  },
];
