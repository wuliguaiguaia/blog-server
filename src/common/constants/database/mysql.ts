/**
 * mysql表字段常用类型
 * https://www.runoob.com/mysql/mysql-data-types.html
 * 数值、日期/时间、字符串
 */

export enum MysqlDataType {
  TINYINT = 'tinyint',
  INT = 'int',
  BIGINT = 'bigint',

  DATE = 'date',
  DATETIME = 'datetime',
  TIMESTAMP = 'timestamp',

  CHAR = 'char',
  VARCHAR = 'varchar',
  TEXT = 'text',
  LONGTEXT = 'longtext',

  BOOLEAN = '',
}
