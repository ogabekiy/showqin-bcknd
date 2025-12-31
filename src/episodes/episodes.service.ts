import { CategoriesService } from './../categories/categories.service';
import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Episode } from './entities/episode.entity';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class EpisodesService {

  constructor(@InjectModel(Episode) private episodeModel: typeof Episode,private readonly categoryService: CategoriesService) {}
  async create(createEpisodeDto: CreateEpisodeDto) {
    await this.categoryService.findOne(createEpisodeDto.category_id);
    return await this.episodeModel.create(createEpisodeDto);
  }

  async findAll() {
    return await this.episodeModel.findAll({include:{all:true}});
  }

  async findOne(id: number) {
    return await this.episodeModel.findOne({ where: { id },include:{all:true} });
  }

  async update(id: number, updateEpisodeDto: UpdateEpisodeDto) {
    await this.episodeModel.update(updateEpisodeDto, { where: { id } });
    return await this.findOne(id);
  }

  async remove(id: number) {
    const episode = await this.findOne(id);
    if(episode.thumbnail_url){
      const filePath = `.${episode.thumbnail_url}`;
      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        console.error('Fayl o\'chirishda xatolik yuz berdi:', error);
      }
    return await this.episodeModel.destroy({ where: { id } });
  }
}}
