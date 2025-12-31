import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Like } from './entities/like.entity';
import { UsersModule } from 'src/users/users.module';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [SequelizeModule.forFeature([Like]),UsersModule,ArticlesModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
