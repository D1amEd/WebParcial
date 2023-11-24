import { Module } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

@Module({
  providers: [PerformerAlbumService],
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
})
export class PerformerAlbumModule {}
