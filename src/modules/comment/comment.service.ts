import { ArticleEntity } from 'src/entities/article.entity';
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
    const { articleId } = commentDto;
    const article = await getRepository(ArticleEntity).findOne(articleId);
    commentDto.article = article;
    return getRepository(CommentEntity).save(commentDto);
  }

  /**
   * 查询comment列表
   */
  async getCommentList(commentDto) {
    const { articleId } = commentDto;
    if (articleId) {
      return this.getCommentListById(commentDto);
    }
  }

  async getCommentListById(commentDto) {
    const { articleId } = commentDto;
    return getRepository(CommentEntity)
      .createQueryBuilder('comment')
      .where(`comment.articleId = ${articleId} and isRead = 1`)
      .orderBy('comment.create_time', 'ASC')
      .getMany();
  }

  /**
   * 删除comment
   */
  async removeComment({ id }) {
    return getRepository(CommentEntity).delete(id);
  }
}
