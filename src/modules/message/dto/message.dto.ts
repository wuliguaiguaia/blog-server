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

export class AllQueryMessageDto {
  @IsNotEmpty({
    message: '页数不能为空',
  })
  prepage: number;

  @IsNotEmpty({
    message: '页码不能为空',
  })
  page: number;

  sort?: number;

  isRead?: number;
}

export class UpdateMessageDto {
  id: number;

  isCheck?: number;
}
