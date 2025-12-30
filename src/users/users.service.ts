import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './dto/entities/user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private UserModel: typeof User){}

  async create(createUserDto: CreateUserDto) {
    console.log('Service received createUserDto:', createUserDto);
    const userbyEmail = await this.UserModel.findOne({where: {email: createUserDto.email}})
    console.log('Checked for existing user by email:', userbyEmail);
    const userbyPhone = await this.UserModel.findOne({where: {phone_number: createUserDto.phone_number}})
    if (userbyPhone) {
      throw new ForbiddenException('User with this phone number already exists');
    }
    if (userbyEmail) {
      throw new ForbiddenException('User already exists');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);


    return await this.UserModel.create(createUserDto);
  }

  async findAll() {
    return await this.UserModel.findAll();
  }

  async findOne(id: number) {
    const user = await this.UserModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
  // 1️⃣ eski userni olamiz
  const user = await this.findOne(id);

  const updatedData: Partial<UpdateUserDto> = { ...updateUserDto };

  // 2️⃣ password hash
  if (updateUserDto.password) {
    updatedData.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  // 3️⃣ avatar yangilanayotgan bo‘lsa → eskisini o‘chiramiz
  if (
    updateUserDto.avatar_url &&
    user.avatar_url &&
    updateUserDto.avatar_url !== user.avatar_url
  ) {
    const oldAvatarPath = path.join(
      process.cwd(),
      user.avatar_url.replace('/', ''),
    );

    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
  }

  // 4️⃣ update
  await this.UserModel.update(updatedData, { where: { id } });

  return this.findOne(id);
}

  async remove(id: number) {
    const user = await this.findOne(id);
    if(user.avatar_url){
      const filePath = path.join(process.cwd(), user.avatar_url.replace(/^\/+/g, ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return await this.UserModel.destroy({where: {id}});
  }
}