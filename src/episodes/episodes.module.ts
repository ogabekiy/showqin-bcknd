import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Episode } from './entities/episode.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [SequelizeModule.forFeature([Episode]),CategoriesModule],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
