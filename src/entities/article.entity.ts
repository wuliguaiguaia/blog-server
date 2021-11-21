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
} from 'typeorm';
import { MysqlDataType } from './../common/constants/database/mysql';
import { UserInfoEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { BaseEntity } from './base-entity/base.entity';

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
  })
  keywords: string;

  @Column({
    type: MysqlDataType.LONGTEXT,
    comment: '内容',
  })
  content: string;

  @ManyToMany(() => CategoryEntity, (category) => category.id)
  @JoinTable()
  category: CategoryEntity[];

  @ManyToOne(() => UserInfoEntity, (user) => user.articles)
  @JoinColumn()
  user: UserInfoEntity;
}
