import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { TrackEntity } from './track.entity/track.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: Repository<TrackEntity>,
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}
  async createTrack(AlbumId: string, track: TrackEntity): Promise<TrackEntity> {
    const album = await this.albumRepository.findOne({
      where: { id: AlbumId },
      relations: ['tracks'],
    });
    if (!album) {
      throw new BusinessLogicException(
        'El album no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (track.nombre.length === 0) {
      throw new BusinessLogicException(
        'El nombre no puede estar vacio',
        BusinessError.PARAMETER_REQUIRED,
      );
    }
    if (track.duracion <= 0) {
      throw new BusinessLogicException(
        'La duracion no puede ser negativa',
        BusinessError.PARAMETER_REQUIRED,
      );
    }
    track.album = album;
    return await this.trackRepository.save(track);
  }
  async findAll(): Promise<TrackEntity[]> {
    return await this.trackRepository.find({
      relations: ['album'],
    });
  }
  async findOne(id: string): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['album'],
    });
    if (!track) {
      throw new BusinessLogicException(
        'El track no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return track;
  }
}
