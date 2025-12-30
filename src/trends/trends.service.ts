import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Trend } from './entities/trend.entity';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class TrendsService {
  constructor(@InjectModel(Trend) private trendModel: typeof Trend,
  private readonly usersService: UsersService,
  private readonly categoriesService: CategoriesService
  ) {}

  async create(createTrendDto: CreateTrendDto) {
    const user = await this.usersService.findOne(createTrendDto.author_id);
    const category = await this.categoriesService.findOne(createTrendDto.category_id);
    return await this.trendModel.create({
      ...createTrendDto
    });
  }

  async findAll() {
    return await this.trendModel.findAll({include:{all:true}});
  }

  async findOne(id: number) {
    const data = await this.trendModel.findByPk(id, {include:{all:true}});
    if(!data){
      throw new NotFoundException('Trend not found');
    }
    data.views_count++;
    await data.save();
    return data;
  }
  

  async update(id: number, updateTrendDto: UpdateTrendDto) {
    const trend = await this.findOne(id);

    const updatedData: Partial<UpdateTrendDto> = {...updateTrendDto};

    if(updateTrendDto.author_id){
      await this.usersService.findOne(updateTrendDto.author_id);
    }

    if(updateTrendDto.category_id){
      await this.categoriesService.findOne(updateTrendDto.category_id);
    }

    return await trend.update(updateTrendDto);
  }

  async remove(id: number) {
  const trend = await this.findOne(id);

  if (trend.medias_urls && trend.medias_urls.length > 0) {
    for (const mediaUrl of trend.medias_urls) {
      // "/uploads/medias/xxx.jpg" -> absolute path
      const filePath = path.join(
        process.cwd(),
        mediaUrl.replace(/^\/+/g, ''),
      );

      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (err) {
        console.error('File o‘chirishda xatolik:', filePath, err);
      }
    }
  }

  await trend.destroy();

  return {
    message: 'Trend va unga tegishli barcha media fayllar o‘chirildi',
  };
}
}
