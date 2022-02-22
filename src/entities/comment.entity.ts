import { MysqlDataType } from './../common/constants/database/mysql';
import { ArticleEntity } from './article.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MessageEntity } from './message.entity';

/**
 * 留言
 */
@Entity('comment')
export class CommentEntity extends MessageEntity {
  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  @Column({
    type: MysqlDataType.INT,
    default: 1 /* TODO */,
    comment: '是否已读',
  })
  isRead: number;

  @Column({
    type: MysqlDataType.INT,
    comment: '回复顶级comment id',
    default: 0,
  })
  replyId: number;

  @Column({
    type: MysqlDataType.INT,
    comment: '回复reply id',
    default: 0,
  })
  replyToReplyId: number;
}
