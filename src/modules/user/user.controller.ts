import { RolesGuard } from './../../common/guards/role.guard';
import { RoleEnum } from './../../common/constants/role';
import { Roles } from './../../common/decorators/role.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req) {
    const { passport } = req.session;
    console.log(req.session);
    if (!passport?.user) {
      return null;
    }
    const { id, role, username } = passport.user;
    return { id, role, username };
  }

  /**
   * 获取用户列表
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getUserList(@Query() userDto: QueryUserDto) {
    return await this.userService.getUserList(userDto);
  }

  /**
   * 手机号查找用户
   */
  @Get(':mobile')
  async getUserByMobile(@Param('mobile') mobile: string) {
    return await this.userService.getUserByMobile(mobile);
  }

  /**
   * 增加用户
   */
  @Post()
  async addUser(@Body() userDto: CreateUserDto) {
    return await this.userService.addUser(userDto);
  }

  /**
   * 更新用户
   */
  @Put()
  async updateUser(@Body() userDto: UpdateUserDto) {
    return await this.userService.updateUser(userDto);
  }

  /**
   * 删除用户
   */
  @Delete(':id') // Delete 只能用param？
  async removeUser(@Param('id') id: string) {
    return await this.userService.removeUser(+id);
  }
}
