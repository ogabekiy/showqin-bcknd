import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/dto/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { SharedModule } from 'src/common/shared.module';

@Module({
  imports: [SequelizeModule.forFeature([User]),UsersModule,SharedModule],
  controllers: [AuthsController],
  providers: [AuthsService],
})
export class AuthsModule {}
