import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleEnum } from 'src/common/constants/role';

@Controller('category')
export class CategoryController {
  // logger: Logger;
  constructor(private readonly cateogoryService: CategoryService) {}

  /**
   * 获取分类列表
   */
  @Get('/list')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getCategoryList() {
    const [list, total] = await this.cateogoryService.getCategoryList();
    return { list, total };
  }

  /**
   * 增加分类
   */
  @Post()
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
  async updateCategory(@Body() categoryDto: UpdateCategoryDto) {
    return await this.cateogoryService.updateCategory(categoryDto);
  }

  /**
   * 删除分类
   */
  @Delete()
  @Transaction()
  async removeCategory(
    @Body('id') id: number,
    @TransactionManager() manager: EntityManager,
  ) {
    return await this.cateogoryService.removeCategory(+id, manager);
  }
}
