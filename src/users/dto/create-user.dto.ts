import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  Matches,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  AUTHOR = 'author',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  username?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9+\-() ]+$/, {
    message: 'phone_number must contain only numbers and phone symbols',
  })
  phone_number?: string;

  @IsString()
  @IsNotEmpty()
  // @Length(5, 30)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // default: 'user'

  @IsBoolean()
  @IsOptional()
  is_active?: boolean; // default: false

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;
}