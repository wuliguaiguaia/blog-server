import { ArticleEntity } from './article.entity';
import { BaseEntity } from './base-entity/base.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { MysqlDataType } from './../common/constants/database/mysql';

@Entity('article_content')
export class ArticleContentEntity extends BaseEntity {
  @Column({
    type: MysqlDataType.LONGTEXT,
    comment: '内容',
    // default: '',
    /* [ExceptionHandler] ER_BLOB_CANT_HAVE_DEFAULT: BLOB, TEXT, GEOMETRY or 
      JSON column 'content' can't have a default value +1ms */
  })
  content: string;

  @OneToOne(() => ArticleEntity, (article) => article.content, {
    onDelete: 'CASCADE', // article被删除，content一起被删除
    // onUpdate: 'CASCADE',
  })
  // @JoinColumn()
  article: ArticleEntity;
}
