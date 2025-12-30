import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/dto/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from 'src/common/config/config.service';
@Injectable()
export class AuthsService {
  constructor(@InjectModel(User) private userModel: typeof User, private readonly userService: UsersService,
  @Inject() private configService: ConfigService
  ) {}
  async register(createAuthDto: CreateUserDto) {
    return await this.userService.create(createAuthDto);
  }

  async login(createLoginDto: CreateLoginDto){
    const data = await this.userModel.findOne({where:{email: createLoginDto.email}})
    if(!data){
      throw new NotFoundException('email or password is incorrect');
    }
    const checkPassword = await bcrypt.compare(createLoginDto.password, data.password);
    if(!checkPassword){
      throw new NotFoundException('email or password is incorrect');
    }
    const jwtSecret = this.configService.get('JWT_ACCESS_TOKEN') || 'default';

    const token = await jwt.sign({email: createLoginDto.email, id: data.id}, jwtSecret, {expiresIn: '7d'})

    return {token}
  }
}
