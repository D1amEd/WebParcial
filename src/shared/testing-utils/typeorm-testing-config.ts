/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
/* Entities*/
export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [/* Entities */],
      synchronize: true,
      keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([/* Entities */]),
   ];
   /* archivo src/shared/testing-utils/typeorm-testing-config.ts*/