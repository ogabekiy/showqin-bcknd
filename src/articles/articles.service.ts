import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './entities/article.entity';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article) private articleModel: typeof Article,
  private readonly userService:UsersService,
  private readonly categoryService: CategoriesService
  ){}

  async create(createArticleDto: CreateArticleDto) {
    const user = await this.userService.findOne(createArticleDto.author_id);
    if(user.role !== 'author' && user.role !== 'admin'){
      throw new NotFoundException('Faqat muallif yoki admin maqomiga ega foydalanuvchilar maqola yaratishi mumkin');
    }
    await this.categoryService.findOne(createArticleDto.category_id);
    return await this.articleModel.create(createArticleDto);
  }

  async findAll() {
    return await this.articleModel.findAll({include:{all:true}});
  }

  async findOne(id: number) {
    const data = await this.articleModel.findByPk(id, {include:{all:true}});
    if(!data){
      throw new NotFoundException('Article not found');
    }
    data.views_count += 1;
    await data.save();
    return data;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    await this.findOne(id);

    const updatedData: Partial<UpdateArticleDto> = {...updateArticleDto};

    if(updateArticleDto.author_id){
      await this.userService.findOne(updateArticleDto.author_id);
    }

    if(updateArticleDto.category_id){
      await this.categoryService.findOne(updateArticleDto.category_id);
    }

    return await this.articleModel.update(updatedData, {where: {id}});
  }

  async updateThumbnail(id: number, thumbnailUrl: string) {
  const article = await this.findOne(id);

  if (article.thumbnail_url) {
  const oldFilePath = path.join(process.cwd(), article.thumbnail_url.replace(/^\/+/g, ''));
  
  if (fs.existsSync(oldFilePath)) {
    fs.unlinkSync(oldFilePath);
  }
}

  article.thumbnail_url = thumbnailUrl;
  await article.save();

  return {
    message: 'Thumbnail muvaffaqiyatli yangilandi',
    thumbnail_url: thumbnailUrl,
  };
}


  async remove(id: number) {
    const article = await this.findOne(id);
    if(article.thumbnail_url){
      const filePath = path.join(process.cwd(), article.thumbnail_url.replace(/^\/+/g, ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return await this.articleModel.destroy({where: {id}});
  }
}
