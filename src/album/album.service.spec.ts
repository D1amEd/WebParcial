import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from './album.entity/album.entity';

describe('AlbumService', () => {
  let service: AlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDataBase();
  });

  const seedDataBase = async () => {
    albumRepository.clear();
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


});
