import { RoleEnum } from './../common/constants/role';
import { MysqlDataType } from './../common/constants/database/mysql';
/**
 * 用户实体
 */

import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { BaseEntity } from './base-entity/base.entity';

@Entity({
  name: 'user',
  // synchronize: false, //架构更新中跳过标有false的实体
})
export class UserInfoEntity extends BaseEntity {
  // js类型推断：number将被转换为integer，string将转换为varchar，boolean转换为bool等
  // or 隐式指定列类型来使用数据库支持的任何列类型

  @Column({
    type: MysqlDataType.VARCHAR,
    comment: '用户名',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    comment: '密码',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    length: 11,
    unique: true,
    nullable: false,
    comment: '手机号',
  })
  mobile: string;

  @Column({
    type: MysqlDataType.TINYINT,
    nullable: false,
    comment: '用户角色',
  })
  role: RoleEnum; // 可以是多个

  @OneToMany(() => ArticleEntity, (article) => article.user)
  articles: ArticleEntity[];
}
