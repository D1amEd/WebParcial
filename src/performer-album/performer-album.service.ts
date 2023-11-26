import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

@Injectable()
export class PerformerAlbumService {
  constructor(
    @InjectRepository(PerformerEntity)
    private readonly performerRepository: Repository<PerformerEntity>,
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}
  async AddPerformerToAlbum(
    albumId: string,
    performerId: string
  ): Promise<AlbumEntity> {
    const performer = await this.performerRepository.findOne({
      where: { id: performerId },
    });
    if (!performer) {
      throw new BusinessLogicException(
        'El performer no existe',
        BusinessError.NOT_FOUND,
      );
    }
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
      relations: ['performers'],
    });
    if (!album) {
      throw new BusinessLogicException(
        'El album no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (album.performers.length >= 3) {
      throw new BusinessLogicException(
        'El album no puede tener mas de 3 performers',
        BusinessError.PARAMETER_REQUIRED,
      );
    }
    album.performers = [...album.performers, performer];
    return await this.albumRepository.save(album);
  }
}
