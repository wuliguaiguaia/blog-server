import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  // 类验证器
  @IsNotEmpty({
    message: '分类名不能为空',
  })
  name: string;
}

export class QueryCategoryDto {
  page: number;
  prepage: number;
}

export class UpdateCategoryDto extends CreateCategoryDto {
  @IsNotEmpty({
    message: '分类id不能为空',
  })
  id: number;
}
