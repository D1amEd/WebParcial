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

  it('should add an performer to a Album', async () => {
    const result = await service.AddPerformerToAlbum(
      albumList[0].id,
      performerList[0].id,
    );
    expect(result).toBeDefined();
    expect(result.performers.length).toBe(1);
    expect(result.performers[0].id).toBe(performerList[0].id);
    expect(result.performers[0].nombre).toBe(performerList[0].nombre);
    expect(result.performers[0].imagen).toBe(performerList[0].imagen);
    expect(result.performers[0].descripcion).toBe(
      performerList[0].descripcion,
    );
    let performer = await performerRepository.findOne(
      {
        where: { id: performerList[0].id },
        relations: ['albums'],
      },);
    expect(performer.albums.length).toBe(1);
    expect(performer.albums[0].id).toBe(albumList[0].id);
  });

  it('should throw an error when the performer does not exist', async () => {
    await expect(
      service.AddPerformerToAlbum(albumList[0].id,'abcd-efgh-ijk'),
    ).rejects.toHaveProperty('message', 'El performer no existe');
  });

  it('should throw an error when the album does not exist', async () => {
    await expect(
      service.AddPerformerToAlbum('abcd-efgh-ijk',performerList[0].id),
    ).rejects.toHaveProperty('message', 'El album no existe');
  });

  it('should throw an error when the album has more than 3 performers', async () => {
    await service.AddPerformerToAlbum(albumList[0].id,performerList[0].id);
    await service.AddPerformerToAlbum(albumList[0].id,performerList[1].id);
    await service.AddPerformerToAlbum(albumList[0].id,performerList[2].id);
    await expect(
      service.AddPerformerToAlbum(albumList[0].id,performerList[3].id),
    ).rejects.toHaveProperty(
      'message',
      'El album no puede tener mas de 3 performers',
    );
  });
});
