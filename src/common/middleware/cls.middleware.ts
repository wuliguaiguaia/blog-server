import { NextFunction } from 'express';
import * as cls from 'cls-hooked';

// "No context available. ns.run() or ns.bind() must be called first.",
export function clsMiddleware(req: Request, res: Response, next: NextFunction) {
  const namespace = cls.createNamespace('lemon'); // 创建命名空间
  const logId = Date.now();
  // namespace.bind(res);
  // namespace.bind(req);
  /** 创建一个可以在其上设置或读取值的新上下文
   *  从该名称空间范围内提供的回调中运行所调用的所有函数(直接或间接地通过本身接受回调的异步函数)
   *  新上下文在被调用时作为参数传递给回调。
   */
  namespace.run(() => {
    namespace.enter(namespace.active);
    namespace.set('logid', logId);
    namespace.set('currReq', req);
    next();
  });
}
