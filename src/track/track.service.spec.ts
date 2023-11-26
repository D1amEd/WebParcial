import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { TrackEntity } from './track.entity/track.entity';

describe('TrackService', () => {
  let service: TrackService;
  let trackRepository: Repository<TrackEntity>;
  let trackList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    trackRepository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    await seedDataBase();
  });

  const seedDataBase = async () => {
    trackRepository.clear();
    trackList = [];
    for (let i = 0; i < 10; i++) {
      const track = await trackRepository.save({
        nombre: faker.person.firstName(),
        duracion: faker.number.int()
      });
      trackList.push(track);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
