import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PerformerEntity } from './performer.entity/performer.entity';

describe('PerformerService', () => {
  let service: PerformerService;
  let performerRepository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    performerRepository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );
    await seedDataBase();
  });

  const seedDataBase = async () => {
    performerRepository.clear();
    performerList = [];
    for (let i = 0; i < 10; i++) {
      const performer = await performerRepository.save({
        nombre: faker.person.firstName(),
        imagen: faker.image.url(),
        descripcion: 'Hola Mundo',
      });
      performerList.push(performer);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a performer', async () => {
    const newPerformer: PerformerEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: 'Hola Mundo',
      albums: [],
    };
    const result = await service.createPerformer(newPerformer);
    expect(result.id).toEqual(newPerformer.id);
    expect(result.nombre).toEqual(newPerformer.nombre);
    expect(result.imagen).toEqual(newPerformer.imagen);
    expect(result.descripcion).toEqual(newPerformer.descripcion);
  });

  it('should not create a performer with a description longer than 100 characters', async () => {
    const newPerformer: PerformerEntity = {
      id: 'abcd-efgh-ijkl-mnop',
      nombre: faker.person.firstName(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraphs(10),
      albums: [],
    };
    await expect(service.createPerformer(newPerformer)).rejects.toHaveProperty(
      'message',
      'La descripcion no puede tener mas de 100 caracteres',
    )
  });

  it('should find all performers', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result.length).toEqual(performerList.length);
  });

  it('should find one performer', async () => {
    const result = await service.findOne(performerList[0].id);
    expect(result.id).toEqual(performerList[0].id);
    expect(result.nombre).toEqual(performerList[0].nombre);
    expect(result.imagen).toEqual(performerList[0].imagen);
    expect(result.descripcion).toEqual(performerList[0].descripcion);
  });

  it('should fail to get one non existent  performer', async () => {
    await expect(service.findOne('abcd-efgh-ijkl-mnop')).rejects.toHaveProperty(
      'message',
      'El performer no existe',
    );
  });
});
