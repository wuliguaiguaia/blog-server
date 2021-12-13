import { MysqlDataType } from './../common/constants/database/mysql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('commit')
export class CommitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: MysqlDataType.INT,
    nullable: false,
    comment: '记录',
  })
  count: number;

  @Column({
    type: MysqlDataType.VARCHAR,
    nullable: false,
    unique: true,
    comment: '时间',
  })
  date: string;
}
