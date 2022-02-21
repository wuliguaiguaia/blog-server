import { MysqlDataType } from '../common/constants/database/mysql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * 建议
 */
@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: Date;

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
