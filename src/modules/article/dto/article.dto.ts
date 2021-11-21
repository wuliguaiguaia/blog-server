import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({
    message: '文章名不能为空',
  })
  title: string;

  @IsNotEmpty({
    message: '类别不能为空',
  })
  categories: any[]; // ?
  keywords: string;
  content: string;
}

export class QueryArticleListDto {
  @IsNotEmpty({
    message: '页码不能为空',
  })
  page: number;

  prepage: number;

  category: number;
}

export class QueryArticleDto {
  @IsNotEmpty({
    message: '文章id不能为空',
  })
  id: number;
}

export class UpdateArticleDto extends QueryArticleDto {
  title: string;

  categories: () => string;

  keywords: string;

  content: string;
}
