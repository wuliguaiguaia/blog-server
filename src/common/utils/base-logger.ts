import * as cls from 'cls-hooked';
import { HttpException } from '@nestjs/common';
import { Request } from 'express';

export default () => {
  const namespace = cls.getNamespace('lemon');
  const currReq: Request = namespace?.get('currReq') || {};
  const logId: number = namespace?.get('logid');
  if (!currReq) {
    // throw new HttpException('获取上下文失败', 200);
  }
  /**
   * express 中
   * > req.url -> "/id"
   * > req.originalUrl -> "/user/id"
   * > req.baseUrl -> "/user"
   *
   */

  const { url, method, body, query, params, user } = currReq;

  return { logId, url, method, body, query, params, user };
};
