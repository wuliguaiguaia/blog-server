import { AuthService } from './auth.service';
// import { MyLogger } from './../../common/utils/logger.service';
import { ApiErrorCode } from './../../common/exceptions/api.code.enum';
import { ApiException } from './../../common/exceptions/api.exception';
import { LoginDto } from './../user/dto/user.dto';
import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, // private readonly logger: MyLogger,
  ) {}

  @UseGuards(AuthGuard('local')) // 本地策略默认名:local
  @Post('login')
  async login(@Request() req) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  // async login(@Body() userDto: LoginDto, @Req() req) {
  //   const { username, password } = userDto;
  //   // console.log(mobile, password);
  //   const user = await this.userService.getUserByName(username);
  //   if (!user) {
  //     throw new ApiException(ApiErrorCode.NOT_VALUABLE_USER_ID, '用户不存在');
  //   }
  //   // 已登录判断
  //   // this.logger.log('xxxxx');
  //   if (user.password !== password) {
  //     throw new ApiException(ApiErrorCode.TABLE_OPERATE_ERROR, '密码错误');
  //   } else {
  //     req.session.userInfo = user; // 登录
  //   }
  //   return true;
  // }

  @Post('register')
  async register(@Body() userDto: LoginDto, @Req() req) {
    // const { username } = userDto;
    // const userq = await this.userService.getUserByName(username);
    // if (!userq) {
    //   throw new ApiException(ApiErrorCode.USERNAME_REPEAT, '用户名已存在');
    // }
    // const user = await this.userService.addUser(userDto);
    // req.session.userInfo = user; // 登录
  }

  @Get('logout')
  async logout(@Req() req, @Res() res) {
    // req.session.destroy((err) => {
    //   // 注销
    //   if (err) {
    //     throw new ApiException(ApiErrorCode.SYSTEM_EXCEPTION_ERROR);
    //   }
    // });
  }
}
