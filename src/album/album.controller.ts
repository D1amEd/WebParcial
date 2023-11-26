import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AlbumEntity } from './album.entity/album.entity';
import { AlbumService } from './album.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AlbumDto } from './album.dto/album.dto';
@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
  constructor(private readonly albumservice: AlbumService) {}

  @Post()
  async createAlbum(@Body() album: AlbumDto): Promise<AlbumEntity> {
    const newAlbum: AlbumEntity = plainToInstance(AlbumEntity, album);
    return await this.albumservice.createAlbum(newAlbum);
  }

  @Get()
  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumservice.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AlbumEntity> {
    return await this.albumservice.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.albumservice.delete(id);
  }
}
