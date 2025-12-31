import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Multer } from 'multer';
import { extname } from 'path';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

   @Post('create')
    @UseInterceptors(
      FileInterceptor('thumbnail', {
        storage: diskStorage({
          destination: './uploads/episode-thumbnails',
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
      @Body() createEpisodeDto: CreateEpisodeDto,
      @UploadedFile() file?: Multer.File,
    ) {
      if (file) {
        createEpisodeDto.thumbnail_url =
          `/uploads/episode-thumbnails/${file.filename}`;
      }

      return this.episodesService.create(createEpisodeDto);
    }

  @Get('all')
  findAll() {
    return this.episodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.episodesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return this.episodesService.update(+id, updateEpisodeDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.episodesService.remove(+id);
  }
}
