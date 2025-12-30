import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from './categories/categories.module';
import { AuthsModule } from './auths/auths.module';
import { ArticlesModule } from './articles/articles.module';
import { TrendsModule } from './trends/trends.module';
import * as dotenv from 'dotenv'
dotenv.config();
@Module({
  imports: [UsersModule,
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      logging: console.log
    }),
    CategoriesModule,
    AuthsModule,
    ArticlesModule,
    TrendsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
