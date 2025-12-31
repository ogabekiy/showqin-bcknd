import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, UploadedFile, NotFoundException, Query } from '@nestjs/common';
import { MediasService } from './medias.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Multer } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post('create')
      @UseInterceptors(
        FileInterceptor('media', {
          storage: diskStorage({
            destination: './uploads/media-files',
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
        @UploadedFile() file?: Multer.File,
      ) {
        
        if (file) {
          const media_url =
            `/uploads/media-files/${file.filename}`;
          return {media_url};
        }
  
        throw new BadRequestException('Fayl yuklanmadi');
      }

  @Delete('delete')
  async remove(@Query('url') url: string) {
    if (!url) {
      throw new BadRequestException('File URL berilmadi');
    }

    /**
     * url misol:
     * /uploads/media-files/123456.png
     */
    const filePath = path.join(process.cwd(), url);

    try {
      // Fayl borligini tekshiramiz
      await fs.promises.access(filePath);

      // Faylni o‘chiramiz
      await fs.promises.unlink(filePath);

      return {
        success: true,
        message: 'Fayl muvaffaqiyatli o‘chirildi',
      };
    } catch (error) {
      throw new NotFoundException('Fayl topilmadi yoki allaqachon o‘chirilgan');
    }
  }
}
