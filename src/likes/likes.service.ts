import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './entities/like.entity';
import { ArticlesService } from 'src/articles/articles.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like) private likeModel: typeof Like,
  private readonly articleService: ArticlesService,
  private readonly userService: UsersService
  ) {}


  async create(createLikeDto: CreateLikeDto) {
  const existingLike = await this.likeModel.findOne({
    where: {
      user_id: createLikeDto.user_id,
      article_id: createLikeDto.article_id,
    },
  });

  // Agar oldin like bosilgan bo‘lsa → UNLIKE
  if (existingLike) {
    await existingLike.destroy();
    return {
      liked: false,
      message: 'Like removed',
    };
  }

  // Aks holda → LIKE
  await this.userService.findOne(createLikeDto.user_id);
  await this.articleService.findOne(createLikeDto.article_id);

  const like = await this.likeModel.create(createLikeDto);

  return {
    liked: true,
    data: like,
    message: 'Article liked',
  };
}



  async findAll() {
    return await this.likeModel.findAll();
  }

  async findOne(id: number) {
    const data = await this.likeModel.findOne({ where: { id } });
    if(!data){
      throw new NotFoundException('Like not found');
    }
    return data;
  }

  async update(id: number, updateLikeDto: UpdateLikeDto) {
    const data = await this.likeModel.findOne({ where: { id } });
    if(!data){
      throw new NotFoundException('Like not found');
    }
    await data.update(updateLikeDto);
    return data;
  }

  async remove(id: number) {
    const data = await this.likeModel.findOne({ where: { id } });
    if(!data){
      throw new NotFoundException('Like not found');
    }
    await data.destroy();
    return { message: 'Like removed' };
  }
}
