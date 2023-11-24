import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity/track.entity';
import { AlbumEntity } from 'src/album/album.entity/album.entity';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
})
export class TrackModule {}
