import { RoleEnum } from './../common/constants/role';
import { MysqlDataType } from './../common/constants/database/mysql';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';

@Entity(
  'user',
  // synchronize: false, //架构更新中跳过标有false的实体
)
export class UserInfoEntity extends BaseEntity {
  // js类型推断：number将被转换为integer，string将转换为varchar，boolean转换为bool等
  // or 隐式指定列类型来使用数据库支持的任何列类型
  @Column({
    type: MysqlDataType.VARCHAR,
    comment: '用户名',
    length: 100,
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    comment: '密码',
    length: 100,
  })
  password: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    length: 11,
    // unique: true,
    default: '',
    comment: '手机号',
  })
  mobile: string;

  @Column({
    type: MysqlDataType.TINYINT,
    default: RoleEnum.NORMAL,
    comment: '用户角色',
  })
  role: RoleEnum;

  // @OneToMany(() => ArticleEntity, (article) => article.user)
  // articles: ArticleEntity[];
}
