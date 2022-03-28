/**
 * 表实体基类
 * 嵌入式实体
 */

import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { MysqlDataType } from './../../common/constants/database/mysql';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: MysqlDataType.BIGINT,
    precision: 13,
    comment: '创建时间',
  })
  createTime: number;

  @Column({
    type: MysqlDataType.BIGINT,
    precision: 13,
    comment: '更新时间',
  })
  updateTime: number;

  @Column({
    type: MysqlDataType.INT,
    default: 0,
    comment: '是否失效',
  })
  deleted: number;
}
