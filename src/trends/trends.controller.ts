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
  Query,
  NotFoundException,
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

  @Patch('add-media/:id')
@UseInterceptors(
  FilesInterceptor('medias', 10, {
    storage: diskStorage({
      destination: './uploads/medias',
      filename: (req, file, cb) => {
        const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueName + extname(file.originalname))
      },
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/')
      ) {
        cb(null, true)
      } else {
        cb(
          new Error('Faqat rasm yoki video yuklash mumkin'),
          false,
        )
      }
    },
  }),
)
async addMedia(
  @Param('id') id: string,
  @UploadedFiles() files: Multer.File[],
) {
  const newMediaUrls = files.map(
    (file) => `/uploads/medias/${file.filename}`,
  )

  // 1️⃣ eski trendni olamiz
  const trend = await this.trendsService.findOne(+id)

  if (!trend) {
    throw new NotFoundException('Trend not found')
  }

  // 2️⃣ eski media array (agar bo‘lmasa bo‘sh array)
  const existingMediaUrls = trend.medias_urls || []

  // 3️⃣ birlashtiramiz
  const updatedMediaUrls = [
    ...existingMediaUrls,
    ...newMediaUrls,
  ]

  // 4️⃣ update
  return this.trendsService.update(+id, {
    medias_urls: updatedMediaUrls,
  })
}


  @Delete('delete-media')
  deleteMedia(
    @Query('trendId') trendId: string,
    @Query('mediaUrl') mediaUrl: string,
  ) {
    return this.trendsService.deleteMedia(+trendId, mediaUrl);
  }
}
