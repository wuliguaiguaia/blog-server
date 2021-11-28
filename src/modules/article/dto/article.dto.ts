import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({
    message: '文章名不能为空',
  })
  title: string;

  @IsNotEmpty({
    message: '类别不能为空',
  })
  categories: string[];

  id: number;

  keywords: string;

  content: string;
}

export class QueryArticleListDto {
  @IsNotEmpty({
    message: '页码不能为空',
  })
  page: number;

  prepage: number;

  categories: string[];

  type: 0 | 1; // categories 查询类型 0: and 1: or
}

export class QueryArticleDto {
  @IsNotEmpty({
    message: '文章id不能为空',
  })
  id: number;
}

export class UpdateArticleDto extends QueryArticleDto {
  title: string;

  categories: string[];

  keywords: string;

  content: string;
}
