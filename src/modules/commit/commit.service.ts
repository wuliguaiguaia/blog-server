/*
 * service 提供操作数据库服务接口
 */
import { EntityManager } from 'typeorm';
import { getRepository } from 'typeorm';
import { CommitEntity } from './../../entities/commit.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(CommitEntity)
export class CommitService {
  /**
   * 增加commit
   */
  async addCommit(manager: EntityManager) {
    const curDay = new Date().toISOString().slice(0, 10);
    const commit = await manager.findOne(CommitEntity, {
      select: ['date', 'count', 'id'],
      where: {
        date: curDay,
      },
    });

    const curCount = commit?.count || 0;
    if (commit) {
      await manager.update(CommitEntity, commit.id, {
        count: curCount + 1,
        date: curDay,
      });
    } else {
      await manager.save(CommitEntity, {
        count: 1,
        date: curDay,
      });
    }
  }

  /**
   * 更新commit
   */
  async updateCommit() {}

  /**
   * 查询commit列表
   */
  async getCommitList({ year }) {
    return getRepository(CommitEntity)
      .createQueryBuilder('commit')
      .where(`commit.date like "%${year}%"`)
      .getMany();
  }
}
