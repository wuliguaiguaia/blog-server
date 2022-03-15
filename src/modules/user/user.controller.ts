import { ApiErrorCode } from 'src/common/exceptions/api.code.enum';
import { ApiException } from 'src/common/exceptions/api.exception';
import { RolesGuard } from './../../common/guards/role.guard';
import { RoleEnum, RoleMap, authConfig } from './../../common/constants/role';
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
import { UpdateUserDto, QueryUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const { passport } = req.session;
    console.log(req.session);
    if (!passport?.user) {
      return null;
    }
    const { id } = passport.user;
    const data = await this.userService.getUserById(id);
    if (!data) {
      throw new ApiException(
        ApiErrorCode.TABLE_OPERATE_ERROR,
        '当前用户不存在',
      );
    }
    const { role, username } = data;
    return { id, role, username };
  }

  /**
   * 获取用户列表
   */
  @Get('list')
  // @UseGuards(RolesGuard)
  // @Roles(RoleEnum.ADMIN)
  async getUserList(@Query() userDto: QueryUserDto) {
    const result = await this.userService.getUserList(userDto);
    const data = result[0].map((item) => {
      delete item.password;
      return item;
    });
    return { list: data, total: result[1] };
  }

  /**
   * 获取用户角色列表
   */
  @Get('rolelist')
  async getUserRoleList() {
    return { roleList: RoleMap, authConfig };
  }

  /**
   * 手机号查找用户
   */
  @Get(':mobile')
  async getUserByMobile(@Param('mobile') mobile: string) {
    return await this.userService.getUserByMobile(mobile);
  }

  /**
   * 更新用户
   */
  @Put()
  async updateUser(@Body() userDto: UpdateUserDto) {
    const { id, username } = userDto;
    let user = await this.userService.getUserById(id);
    if (!user) {
      throw new ApiException(ApiErrorCode.NOT_VALUABLE_USER_ID);
    }
    if (username !== undefined) {
      user = await this.userService.getUserByName(username);
      if (user && user.id !== id) {
        throw new ApiException(ApiErrorCode.USERNAME_REPEAT);
      }
    }
    return await this.userService.updateUser(userDto);
  }

  /**
   * 删除用户
   */
  @Delete()
  async removeUser(@Body('id') id: number) {
    return await this.userService.removeUser(+id);
  }
}
