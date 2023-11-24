import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from './album/album.module';
import { PerformerModule } from './performer/performer.module';
import { TrackModule } from './track/track.module';
import { AlbumEntity } from './album/album.entity/album.entity';
import { PerformerEntity } from './performer/performer.entity/performer.entity';
import { TrackEntity } from './track/track.entity/track.entity';
import { PerformerAlbumModule } from './performer-album/performer-album.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [AlbumEntity, PerformerEntity, TrackEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AlbumModule,
    PerformerModule,
    TrackModule,
    PerformerAlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
