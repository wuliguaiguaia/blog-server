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
    commentDto.createTime = Date.now();
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
   * 审核comment
   */
  async checkComment(commentDto) {
    const { id, isCheck } = commentDto;
    return getRepository(CommentEntity).update(id, { isCheck });
  }

  /**
   * 查询comment列表
   */
  async getCommentList(commentDto) {
    const { prepage, page, articleId, sort = 0, isCheck } = commentDto;
    const queryBuilder = getRepository(CommentEntity)
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article');

    // TODO： 优化where
    let data = [];
    if (articleId) {
      if (isCheck !== undefined) {
        data = await queryBuilder
          .where(
            `comment.articleId = ${articleId} and comment.isCheck = ${isCheck}`,
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

    if (isCheck !== undefined) {
      data = await queryBuilder
        .where(`comment.isCheck = ${isCheck}`)
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
        // .where(`comment.articleId = ${articleId} and isCheck = 1`)
        .orderBy('comment.createTime', 'ASC')
        .getMany()
    );
  }

  /**
   * 删除comment
   */
  async removeComment(id: number) {
    return await getRepository(CommentEntity)
      .createQueryBuilder()
      .delete()
      .from(CommentEntity)
      .where('id = :id', { id })
      .execute();
  }
}
