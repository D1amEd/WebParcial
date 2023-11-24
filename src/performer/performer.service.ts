import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { PerformerEntity } from './performer.entity/performer.entity';
@Injectable()
export class PerformerService {
  constructor(
    @InjectRepository(PerformerEntity)
    private readonly performerRepository: Repository<PerformerEntity>,
  ) {}
  async createPerformer(performer: PerformerEntity): Promise<PerformerEntity> {
    if (performer.descripcion.length > 100) {
      throw new BusinessLogicException(
        'La descripcion no puede tener mas de 100 caracteres',
        BusinessError.PARAMETER_REQUIRED,
      );
    }
    return await this.performerRepository.save(performer);
  }
  async findAll(): Promise<PerformerEntity[]> {
    return await this.performerRepository.find({
      relations: ['albums'],
    });
  }
  async findOne(id: string): Promise<PerformerEntity> {
    const performer = await this.performerRepository.findOne({
      where: { id },
      relations: ['albums'],
    });
    if (!performer) {
      throw new BusinessLogicException(
        'El performer no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return performer;
  }
}
