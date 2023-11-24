import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { AlbumEntity } from './album.entity/album.entity';
@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}
  async createAlbum(album: AlbumEntity): Promise<AlbumEntity> {
    if (album.nombre.length === 0) {
      throw new BusinessLogicException(
        'El nombre no puede estar vacio',
        BusinessError.PARAMETER_REQUIRED,
      );
    }
    if (album.descripcion.length === 0) {
      throw new BusinessLogicException(
        'La descripcion no puede estar vacia',
        BusinessError.PARAMETER_REQUIRED,
      );
    }
    return await this.albumRepository.save(album);
  }

  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find({
      relations: ['tracks', 'performers'],
    });
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
    if (!album) {
      throw new BusinessLogicException(
        'El album no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return album;
  }

  async delete(id: string): Promise<void> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks'],
    });
    if (!album) {
      throw new BusinessLogicException(
        'El album no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (album.tracks.length > 0) {
      throw new BusinessLogicException(
        'El album no puede ser eliminado porque tiene tracks asociados',
        BusinessError.PRECONDITION_FAILED,
      );
    } 
    await this.albumRepository.remove(album);
  }
}
