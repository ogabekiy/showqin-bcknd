import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
  import type { Multer } from 'multer';
import { extname } from 'path';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './uploads/thumbnails',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Faqat rasm yoki video yuklash mumkin',
            ),
            false,
          );
        }
      },
    }),
  )
  create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file?: Multer.File,
  ) {
    if (file) {
      createArticleDto.thumbnail_url =
        `/uploads/thumbnails/${file.filename}`;
    }

    return this.articlesService.create(createArticleDto);
  }


  @Get('all')
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Patch('update-thumbnail/:id')
@UseInterceptors(
  FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: './uploads/thumbnails',
      filename: (req, file, cb) => {
        const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/')
      ) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            'Faqat rasm yoki video yuklash mumkin',
          ),
          false,
        );
      }
    },
  }),
)
updateThumbnail(
  @Param('id') id: string,
  @UploadedFile() file: Multer.File,
) {
  if (!file) {
    throw new BadRequestException('Thumbnail yuborilmadi');
  }

  const thumbnailUrl = `/uploads/thumbnails/${file.filename}`;

  return this.articlesService.updateThumbnail(+id, thumbnailUrl);
}


  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
