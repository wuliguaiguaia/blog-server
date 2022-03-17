import { authConfig } from './../../common/constants/role';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
  // logger: Logger;
  constructor(private readonly cateogoryService: CategoryService) {}

  /**
   * 获取分类列表
   */
  @Get('/list')
  async getCategoryList(@Req() req) {
    // console.log(req.user);
    const [list, total] = await this.cateogoryService.getCategoryList();
    return { list, total };
  }

  /**
   * 增加分类
   */
  @Post()
  @Roles(authConfig.category.add)
  @UseGuards(AuthGuard('applySession'))
  async addCategory(@Body() categoryDto: CreateCategoryDto) {
    const r = await this.cateogoryService.addCategory(categoryDto);
    if (r.raw) {
      return {
        id: r.raw.insertId,
      };
    }
  }

  /**
   * 更新分类
   */
  @Put()
  @Roles(authConfig.category.edit)
  @UseGuards(AuthGuard('applySession'))
  async updateCategory(@Body() categoryDto: UpdateCategoryDto) {
    return await this.cateogoryService.updateCategory(categoryDto);
  }

  /**
   * 删除分类
   */
  @Delete()
  @Transaction()
  @Roles(authConfig.category.delete)
  @UseGuards(AuthGuard('applySession'))
  async removeCategory(
    @Body('id') id: number,
    @TransactionManager() manager: EntityManager,
  ) {
    return await this.cateogoryService.removeCategory(+id, manager);
  }
}
