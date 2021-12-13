import { IsNotEmpty } from 'class-validator';

// data transfer object

export class CommitDto {
  @IsNotEmpty({
    message: '日期不能为空',
  })
  date: string;

  @IsNotEmpty({
    message: '数量不能为空',
  })
  count: string;
}
