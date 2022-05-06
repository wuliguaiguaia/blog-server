import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// data transfer object

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsString()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @IsNumber()
  @IsOptional()
  role?: number;
}

export class QueryUserDto {
  @IsNotEmpty({
    message: '页码不能为空',
  })
  page: number;

  @IsNotEmpty({
    message: '每页条数不能为空',
  })
  prepage: number;

  @IsOptional()
  role?: string;
}

export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  role?: number;
}

export class DeleteUserDto {}

export class LoginDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
