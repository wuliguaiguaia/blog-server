import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({
    message: '文章ID不能为空',
  })
  articleId: number;

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

  website?: string;
  replyId?: number;
  replyToReplyId?: number;
}

export class QueryCommentDto {
  articleId?: number;
}
