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
import { TrackEntity } from './track.entity/track.entity';
import { TrackService } from './track.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TrackDto } from './track.dto/track.dto';
@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
  constructor(private readonly trackservice: TrackService) {}

  @Post('albums/:albumId')
  async createTrack(
    @Param('albumId') albumId: string,
    @Body() track: TrackDto,
  ): Promise<TrackEntity> {
    const newTrack: TrackEntity = plainToInstance(TrackEntity, track);
    return await this.trackservice.createTrack(albumId, newTrack);
  }

  @Get()
  async findAll(): Promise<TrackEntity[]> {
    return await this.trackservice.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TrackEntity> {
    return await this.trackservice.findOne(id);
  }
}
