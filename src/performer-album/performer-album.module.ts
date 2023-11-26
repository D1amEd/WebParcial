import { Module } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { PerformerAlbumController } from './performer-album.controller';

@Module({
  providers: [PerformerAlbumService],
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
  controllers: [PerformerAlbumController],
})
export class PerformerAlbumModule {}
