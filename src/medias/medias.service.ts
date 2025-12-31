import { Injectable } from '@nestjs/common';

@Injectable()
export class MediasService {
  remove(url: string) {
    return `This action removes a #${url} media`;
  }
}
