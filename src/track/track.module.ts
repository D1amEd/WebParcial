import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity/track.entity';
import { AlbumEntity } from 'src/album/album.entity/album.entity';
import { TrackController } from './track.controller';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
  controllers: [TrackController],
})
export class TrackModule {}
