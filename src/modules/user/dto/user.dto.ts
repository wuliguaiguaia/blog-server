import { IsNotEmpty } from 'class-validator';

// data transfer object

export class CreateUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

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

  role?: string;
}

export class UpdateUserDto {
  @IsNotEmpty({
    message: '用户id不能为空',
  })
  id: number;

  username?: string;

  password?: string;

  role?: number;
}

export class DeleteUserDto {}

export class LoginDto {
  // @IsNotEmpty({
  //   message: '手机号不能为空',
  // })
  // mobile: string;

  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
