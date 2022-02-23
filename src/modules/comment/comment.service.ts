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
   * 已读comment
   */
  async readComment(commentDto) {
    const { id } = commentDto;
    return getRepository(CommentEntity).update(id, { isRead: 1 });
  }

  /**
   * 查询comment列表
   */
  async getCommentList(commentDto) {
    const { prepage, page, articleId, sort = 0, isRead } = commentDto;
    const queryBuilder = getRepository(CommentEntity)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article');

    let data = [];
    if (articleId) {
      if (isRead !== undefined) {
        data = await queryBuilder
          .where(
            `comment.articleId = ${articleId} and comment.isRead = ${isRead}`,
          )
          .orderBy('comment.createTime', Number(sort) === 0 ? 'DESC' : 'ASC')
          .skip(prepage * (page - 1))
          .take(prepage * page)
          .getManyAndCount();
      } else {
        data = await queryBuilder
          .where(`comment.articleId = ${articleId}`)
          .orderBy('comment.createTime', Number(sort) === 0 ? 'DESC' : 'ASC')
          .skip(prepage * (page - 1))
          .take(prepage * page)
          .getManyAndCount();
      }
    }

    if (isRead !== undefined) {
      data = await queryBuilder
        .where(`comment.isRead = ${isRead}`)
        .orderBy('comment.createTime', Number(sort) === 0 ? 'DESC' : 'ASC')
        .skip(prepage * (page - 1))
        .take(prepage * page)
        .getManyAndCount();
    } else {
      data = await queryBuilder
        .orderBy('comment.createTime', Number(sort) === 0 ? 'DESC' : 'ASC')
        .skip(prepage * (page - 1))
        .take(prepage * page)
        .getManyAndCount();
    }
    data[0] = data[0].map((item) => {
      item.articleId = item.article.id;
      delete item.article;
      return item;
    });
    return data;
  }

  /**
   * 查询comment列表
   */
  async getCommentListById(commentDto) {
    const { articleId } = commentDto;
    return (
      getRepository(CommentEntity)
        .createQueryBuilder('comment')
        .where(`comment.articleId = ${articleId}`)
        // .where(`comment.articleId = ${articleId} and isRead = 1`)
        .orderBy('comment.create_time', 'ASC')
        .getMany()
    );
  }

  /**
   * 删除comment
   */
  async removeComment({ id }) {
    return getRepository(CommentEntity)
      .createQueryBuilder()
      .delete()
      .from(CommentEntity)
      .where('id = :id', { id })
      .execute();
  }
}
