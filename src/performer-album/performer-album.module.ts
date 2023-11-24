import { Module } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';

@Module({
  providers: [PerformerAlbumService]
})
export class PerformerAlbumModule {}
