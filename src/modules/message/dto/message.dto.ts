import { IsNotEmpty } from 'class-validator';

export class MessageDto {
  @IsNotEmpty({
    message: '内容不能为空',
  })
  content: string;

  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  website: string;
}
