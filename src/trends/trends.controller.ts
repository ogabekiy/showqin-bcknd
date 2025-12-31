import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Multer } from 'multer';
import { extname } from 'path';

import { TrendsService } from './trends.service';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';
import { RoleGuard } from 'src/common/guards/roleGuard';
import { Roles } from 'src/common/guards/roles.decorator';

@Controller('trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @UseGuards(RoleGuard)
  @Roles('admin', 'author')
  @Post('create')
  @UseInterceptors(
    FilesInterceptor('medias', 10, {
      storage: diskStorage({
        destination: './uploads/medias',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          cb(null, true);
        } else {
          cb(new Error('Faqat rasm yoki video yuklash mumkin'), false);
        }
      },
    }),
  )
  create(
    @UploadedFiles() files: Multer.File[],
    @Body() createTrendDto: CreateTrendDto,
  ) {
    const mediasUrls = files.map(
      (file) => `/uploads/medias/${file.filename}`,
    );

    console.log(mediasUrls);

    return this.trendsService.create({
      ...createTrendDto,
      medias_urls: mediasUrls,
    });
  }

  @Get('all')
  findAll() {
    return this.trendsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trendsService.findOne(+id);
  }

  @UseGuards(RoleGuard)
  @Roles('admin', 'author')
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTrendDto: UpdateTrendDto) {
    return this.trendsService.update(+id, updateTrendDto);
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.trendsService.remove(+id);
  }
}
