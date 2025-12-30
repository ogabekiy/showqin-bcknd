import { Module } from '@nestjs/common';
import { TrendsService } from './trends.service';
import { TrendsController } from './trends.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Trend } from './entities/trend.entity';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [SequelizeModule.forFeature([Trend]),UsersModule,CategoriesModule],
  controllers: [TrendsController],
  providers: [TrendsService],
})
export class TrendsModule {}
