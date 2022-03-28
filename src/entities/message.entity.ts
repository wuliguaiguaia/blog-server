import { MysqlDataType } from '../common/constants/database/mysql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 建议
 */
@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: MysqlDataType.BIGINT,
    precision: 13,
    comment: '创建时间',
  })
  createTime: number;

  @Column({
    type: MysqlDataType.INT,
    default: 0,
    comment: '是否已读',
  })
  isRead: number;

  @Column({
    type: MysqlDataType.INT,
    default: 0,
    comment: '是否审核',
  })
  isCheck: number;

  @Column({
    type: MysqlDataType.VARCHAR,
    nullable: false,
    name: 'content',
    comment: '内容',
  })
  content: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    nullable: false,
    name: 'username',
    comment: '用户名',
  })
  username: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    nullable: false,
    name: 'email',
    comment: '邮箱',
  })
  email: string;

  @Column({
    type: MysqlDataType.VARCHAR,
    nullable: false,
    comment: '个人网站',
    default: '',
  })
  website: string;
}
