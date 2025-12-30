import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateLoginDto } from './dto/login.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authsService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.authsService.login(createLoginDto);
  }

}
