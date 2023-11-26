import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from './album.entity/album.entity';
import { TrackEntity } from '../track/track.entity/track.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[];
  let trackRepository: Repository<TrackEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    trackRepository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    await seedDataBase();
  });

  const seedDataBase = async () => {
    albumRepository.clear();
    trackRepository.clear();
    albumList = [];
    for (let i = 0; i < 10; i++) {
      const album = await albumRepository.save({
        nombre: faker.person.firstName(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.paragraph(),
      });
      albumList.push(album);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a album', async () => {
    const newAlbum: AlbumEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: [],
      performers: [],
    };
    const album = await service.createAlbum(newAlbum);
    expect(album).not.toBeNull();
    const storedAlbum = await albumRepository.findOne({
      where: { id: album.id },
    });
    expect(album).toBeDefined();
    expect(album.id).toEqual(storedAlbum.id);
    expect(album.nombre).toEqual(storedAlbum.nombre);
    expect(album.caratula).toEqual(storedAlbum.caratula);
    expect(album.fechaLanzamiento).toEqual(storedAlbum.fechaLanzamiento);
    expect(album.descripcion).toEqual(storedAlbum.descripcion);
  });

  it('create album should fail because empty description', async () => {
    const newAlbum: AlbumEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: '',
      tracks: [],
      performers: [],
    };
    await expect(service.createAlbum(newAlbum)).rejects.toHaveProperty(
      'message',
      'La descripcion no puede estar vacia',
    );
  });
  it('create album should fail because empty name', async () => {
    const newAlbum: AlbumEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: '',
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: [],
      performers: [],
    };
    await expect(service.createAlbum(newAlbum)).rejects.toHaveProperty(
      'message',
      'El nombre no puede estar vacio',
    );
  });

  it('should find all albums', async () => {
    const albums = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums.length).toEqual(albumList.length);
  });

  it('should find one album', async () => {
    const album = await service.findOne(albumList[0].id);
    expect(album).not.toBeNull();
    expect(album.id).toEqual(albumList[0].id);
    expect(album.nombre).toEqual(albumList[0].nombre);
    expect(album.caratula).toEqual(albumList[0].caratula);
    expect(album.fechaLanzamiento).toEqual(albumList[0].fechaLanzamiento);
    expect(album.descripcion).toEqual(albumList[0].descripcion);
  });

  it('should fail finding one album because not found', async () => {
    await expect(service.findOne('abcd-efgh-ijkl-mnop')).rejects.toHaveProperty(
      'message',
      'El album no existe',
    );
  });

  it('should delete one album', async () => {
    const album = await service.findOne(albumList[0].id);
    expect(album).not.toBeNull();
    await service.delete(album.id);
    await expect(service.findOne(album.id)).rejects.toHaveProperty(
      'message',
      'El album no existe',
    );
    const deletedMuseum = await albumRepository.findOne({
      where: { id: album.id },
    });
    expect(deletedMuseum).toBeNull();
  });

  it('should fail deleting one album because not found', async () => {
    await expect(service.delete('abcd-efgh-ijkl-mnop')).rejects.toHaveProperty(
      'message',
      'El album no existe',
    );
  });

  it('should fail deleting one album because has tracks', async () => {
    const newTrack: TrackEntity = await trackRepository.save({
      nombre: faker.person.firstName(),
      duracion: faker.number.int(),
    });
    const album = await albumRepository.findOne({
      where: { id: albumList[0].id },
      relations: ['tracks'],
    });
    album.tracks = [...album.tracks, newTrack];
    await albumRepository.save(album);
    await expect(service.delete(albumList[0].id)).rejects.toHaveProperty(
      'message',
      'El album no puede ser eliminado porque tiene tracks asociados',
    );
  });
});
