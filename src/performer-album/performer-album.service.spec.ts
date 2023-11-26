import { Test, TestingModule } from '@nestjs/testing';
import { PerformerAlbumService } from './performer-album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { AlbumEntity } from '../album/album.entity/album.entity';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;
  let performerRepository: Repository<PerformerEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let performerList: PerformerEntity[];
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerAlbumService],
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
    performerRepository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDataBase();
  });

  //Dado que no es necesario, no voy a agregar ninguna asociacion entre los albums y los performers en seed database
  const seedDataBase = async () => {
    performerRepository.clear();
    albumRepository.clear();
    performerList = [];
    albumList = [];
    for (let i = 0; i < 10; i++) {
      const performer = await performerRepository.save({
        nombre: faker.person.firstName(),
        imagen: faker.image.url(),
        descripcion: 'Hola Mundo',
      });
      performerList.push(performer);
    }
    for (let i = 0; i < 10; i++) {
      const album = await albumRepository.save({
        nombre: faker.commerce.productName(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.commerce.productDescription(),
      });
      albumList.push(album);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add an album to a performer', async () => {
    const result = await service.addAlbumToPerformer(
      performerList[0].id,
      albumList[0].id,
    );
    expect(result.albums.length).toEqual(1);
    expect(result.albums[0].id).toEqual(albumList[0].id);
    expect(result.albums[0].nombre).toEqual(albumList[0].nombre);
    expect(result.albums[0].caratula).toEqual(albumList[0].caratula);
    expect(result.albums[0].fechaLanzamiento).toEqual(
      albumList[0].fechaLanzamiento,
    );
    expect(result.albums[0].descripcion).toEqual(albumList[0].descripcion);
    const Album = await albumRepository.findOne({
      where: { id: albumList[0].id },
      relations: ['performers'],
    });
    expect(Album.performers.length).toEqual(1);
    expect(Album.performers[0].id).toEqual(performerList[0].id);
  });

  it('should throw an error when the performer does not exist', async () => {
    await expect(
      service.addAlbumToPerformer('abcd-efgh-ijk', albumList[0].id),
    ).rejects.toHaveProperty('message', 'El performer no existe');
  });

  it('should throw an error when the album does not exist', async () => {
    await expect(
      service.addAlbumToPerformer(performerList[0].id, 'abcd-efgh-ijk'),
    ).rejects.toHaveProperty('message', 'El album no existe');
  });

  it('should throw an error when the performer has more than 3 albums', async () => {
    await service.addAlbumToPerformer(performerList[0].id, albumList[0].id);
    await service.addAlbumToPerformer(performerList[0].id, albumList[1].id);
    await service.addAlbumToPerformer(performerList[0].id, albumList[2].id);
    await expect(
      service.addAlbumToPerformer(performerList[0].id, albumList[3].id),
    ).rejects.toHaveProperty(
      'message',
      'El performer no puede tener mas de 3 albums',
    );
  });
});
