import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { PerformerEntity } from './performer.entity/performer.entity';
import { PerformerService } from './performer.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PerformerDto } from './performer.dto/performer.dto';
import { plainToInstance } from 'class-transformer';
@Controller('performers')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerController {
  constructor(private readonly performerservice: PerformerService) {}
  @Post()
  async createPerformer(
    @Body() performer: PerformerDto,
  ): Promise<PerformerEntity> {
    const newPerformer: PerformerEntity = plainToInstance(
      PerformerEntity,
      performer,
    );
    return await this.performerservice.createPerformer(newPerformer);
  }

  @Get()
  async findAll(): Promise<PerformerEntity[]> {
    return await this.performerservice.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PerformerEntity> {
    return await this.performerservice.findOne(id);
  }

}
