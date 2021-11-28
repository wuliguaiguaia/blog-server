import { MysqlDataType } from './../../common/constants/database/mysql';
/**
 * 表实体基类
 * 嵌入式实体
 */

import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

// abstract
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    // 自动设置为实体的插入时间。 不需要在此列中手动写入值，该值会自动设置
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date;

  @Column({
    type: MysqlDataType.INT,
    default: 0,
    comment: '是否失效',
  })
  deleted: number;
}
