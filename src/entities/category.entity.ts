import { MysqlDataType } from './../common/constants/database/mysql';
import { ArticleEntity } from './article.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @Column({
    type: MysqlDataType.VARCHAR,
    length: 100,
    nullable: false,
    unique: true,
    comment: '分类名',
  })
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.categories)
  articles: ArticleEntity[];

  articlesLen: number;
}
