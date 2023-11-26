import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { TrackEntity } from './track.entity/track.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let trackRepository: Repository<TrackEntity>;
  let trackList: TrackEntity[];
  let albumRepository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    trackRepository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDataBase();
  });

  const seedDataBase = async () => {
    trackRepository.clear();
    albumRepository.clear();
    trackList = [];
    albumList = [];
    for (let i = 0; i < 10; i++) {
      const track = await trackRepository.save({
        nombre: faker.person.firstName(),
        duracion: faker.number.int(),
      });
      const album = await albumRepository.save({
        nombre: faker.person.firstName(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.paragraph(),
      });
      albumList.push(album);
      trackList.push(track);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a track', async () => {
    const newTrack: TrackEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: faker.person.firstName(),
      duracion: faker.number.int(),
      album: undefined,
    };
    const track = await service.createTrack(albumList[0].id, newTrack);
    expect(track).toBeDefined();
    expect(track.id).toBeDefined();
    expect(track.nombre).toEqual(newTrack.nombre);
    expect(track.duracion).toEqual(newTrack.duracion);
    expect(track.album.id).toEqual(albumList[0].id);
    expect(track.album.nombre).toEqual(albumList[0].nombre);
    expect(track.album.caratula).toEqual(albumList[0].caratula);
    expect(track.album.fechaLanzamiento).toEqual(albumList[0].fechaLanzamiento);
    expect(track.album.descripcion).toEqual(albumList[0].descripcion);
  });

  it('should not create a track with empty name', async () => {
    const newTrack: TrackEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: '',
      duracion: faker.number.int(),
      album: undefined,
    };
    expect(
      service.createTrack(albumList[0].id, newTrack),
    ).rejects.toHaveProperty('message', 'El nombre no puede estar vacio');
  });

  it('should not create a track with negative duration', async () => {
    const newTrack: TrackEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: faker.person.firstName(),
      duracion: -1,
      album: undefined,
    };
    expect(
      service.createTrack(albumList[0].id, newTrack),
    ).rejects.toHaveProperty(
      'message',
      'La duracion no puede ser negativa',
    );
  });

  it('should not create a track with invalid album id', async () => {
    const newTrack: TrackEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: faker.person.firstName(),
      duracion: faker.number.int(),
      album: undefined,
    };
    expect(
      service.createTrack('invalid-id', newTrack),
    ).rejects.toHaveProperty('message', 'El album no existe');
  });

  it('should find all tracks', async () => {
    const tracks = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks.length).toEqual(trackList.length);
  });

  it('should find one track', async () => {
    const track = await service.findOne(trackList[0].id);
    expect(track).not.toBeNull();
    expect(track.id).toEqual(trackList[0].id);
    expect(track.nombre).toEqual(trackList[0].nombre);
    expect(track.duracion).toEqual(trackList[0].duracion);
  });

  it('should fail finding one track because not found', async () => {
    await expect(service.findOne('abcd-efgh-ijkl-mnop')).rejects.toHaveProperty(
      'message',
      'El track no existe',
    );
  });

});
