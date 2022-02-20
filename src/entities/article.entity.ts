/**
 * 文章实体
 */

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { MysqlDataType } from './../common/constants/database/mysql';
import { UserInfoEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from './base-entity/base.entity';
import { ArticleContentEntity } from './article_content.entity';
import { CommentEntity } from './comment.entity';

@Entity('article')
export class ArticleEntity extends BaseEntity {
  @Column({
    type: MysqlDataType.VARCHAR,
    length: 100,
    nullable: false,
    unique: true,
    comment: '文章名',
  })
  title: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    length: 100,
    comment: '关键词',
    default: '',
  })
  keywords: string;

  @OneToOne(() => ArticleContentEntity, (content) => content.article, {
    cascade: true, // 创建时同时更新到content
  })
  content: ArticleContentEntity;

  @Column({
    type: MysqlDataType.INT,
    comment: '浏览次数',
    default: 0,
  })
  viewCount: string;

  @Column({
    type: MysqlDataType.TINYINT,
    comment: '是否发布',
    default: 0,
  })
  published: number;

  @ManyToMany(() => CategoryEntity, (category) => category.articles, {
    onDelete: 'CASCADE', // 同时删除关系
  })
  categories: CategoryEntity[];

  @ManyToOne(() => UserInfoEntity, (user) => user.articles)
  @JoinColumn()
  user: UserInfoEntity;
  /* 在多对一/一对多的关系中，拥有方总是多对一的 */

  contentSlice: string;

  @OneToMany((type) => CommentEntity, (comment) => comment.article) // note: we will create author property in the Photo class below

  comments: CommentEntity[]

}
