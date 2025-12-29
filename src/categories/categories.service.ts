import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryModel.findOne({where: {slug: createCategoryDto.slug}});
    if (data) {
      throw new ForbiddenException('Category with this slug already exists');
    }
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryModel.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    const updatedData: Partial<UpdateCategoryDto> = { ...updateCategoryDto };
    return await this.categoryModel.update(updatedData, { where: { id } });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.categoryModel.destroy({ where: { id } });
  }
}
