/*
 * service 提供操作数据库服务接口
 */
import { getRepository } from 'typeorm';
import { EntityRepository } from 'typeorm';
import { CommentEntity } from 'src/entities/comment.entity';

@EntityRepository(CommentEntity)
export class CommentService {
  /**
   * 增加comment
   */
  async addComment(commentDto) {
    return getRepository(CommentEntity).save(commentDto)
  }

  /**
   * 更新comment
   */
  async updateComment() {}

  /**
   * 查询comment列表
   */
  async getCommentList() {
    return getRepository(CommentEntity)
      .createQueryBuilder('comment')
      .getManyAndCount();
  }
}
