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
  async addAlbumToPerformer(
    performerId: string,
    albumId: string,
  ): Promise<PerformerEntity> {
    const performer = await this.performerRepository.findOne({
      where: { id: performerId },
      relations: ['albums'],
    });
    if (!performer) {
      throw new BusinessLogicException(
        'El performer no existe',
        BusinessError.NOT_FOUND,
      );
    }
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });
    if (!album) {
      throw new BusinessLogicException(
        'El album no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (performer.albums.length > 3) {
      throw new BusinessLogicException(
        'El performer no puede tener mas de 3 albums',
        BusinessError.PARAMETER_REQUIRED,
      );
    }
    album.performers = [...album.performers, performer];
    return await this.performerRepository.save(performer);
  }
}
