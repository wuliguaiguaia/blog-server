import { AuthService } from './auth.service';
// import { MyLogger } from './../../common/utils/logger.service';
import { ApiErrorCode } from './../../common/exceptions/api.code.enum';
import { ApiException } from './../../common/exceptions/api.exception';
import { LoginDto } from './../user/dto/user.dto';
import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    console.log('JWT验证 - Step 1: 用户请求登录 req.user');
    return this.authService.login(req.session.passport.user);
  }

  @UseGuards(AuthGuard('applySession'))
  @Get('profile')
  getProfile(@Request() req) {
    return true;
  }

  @Post('register')
  async register(@Body() userDto: LoginDto) {
    const { username } = userDto;
    const user = await this.userService.getUserByName(username);
    if (user) {
      throw new ApiException(ApiErrorCode.USERNAME_REPEAT);
    }
    await this.userService.addUser(userDto);
    return true;
  }

  @Delete('logout')
  async logout(@Request() req) {
    req.session.destroy((err) => {
      // 注销
      if (err) {
        throw new ApiException(ApiErrorCode.SYSTEM_EXCEPTION_ERROR);
      }
    });
    return null;
  }
}
