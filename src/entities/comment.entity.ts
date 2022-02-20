import { ArticleEntity } from './article.entity';
import { Entity, ManyToOne } from 'typeorm';
import { MessageEntity } from './message.entity';

/**
 * 留言
 */
@Entity('comment')
export class CommentEntity extends MessageEntity {
  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity
  
  reply_comment_id: number 
}
