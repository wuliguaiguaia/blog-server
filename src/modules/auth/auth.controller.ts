import { AuthService } from './auth.service';
import { MyLogger } from './../../common/utils/logger.service';
import { ApiErrorCode } from './../../common/exceptions/api.code.enum';
import { ApiException } from './../../common/exceptions/api.exception';
import { LoginDto } from './../user/dto/user.dto';
import { UserService } from './../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logger: MyLogger,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    this.logger.log(`JWT验证 - Step 1: 用户请求登录 `, req.user, 'login');
    return this.authService.login(/* req.session.passport.user */ req.user);
  }

  @UseGuards(AuthGuard('applySession'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body() userDto: LoginDto) {
    userDto.username = userDto.username.trim();
    const { username, password } = userDto;
    const user = await this.userService.getUserByName(username);
    if (user) {
      throw new ApiException(ApiErrorCode.USERNAME_REPEAT);
    }
    const pattern = /^[a-z0-8]{8,}$/;
    if (!pattern.test(password)) {
      throw new ApiException(
        ApiErrorCode.TABLE_OPERATE_ERROR,
        '密码只能是数字或字母，且必须在八位以上',
      );
    }
    await this.userService.addUser(userDto);
    return true;
  }

  @Delete('logout')
  async logout(@Request() req) {
    console.log(222);
    req.session.destroy((err) => {
      // 注销
      if (err) {
        throw new ApiException(ApiErrorCode.SYSTEM_EXCEPTION_ERROR, '登出失败');
      }
    });
    return null;
  }
}
