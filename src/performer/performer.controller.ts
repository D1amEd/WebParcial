import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { PerformerEntity } from './performer.entity/performer.entity';
import { PerformerService } from './performer.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('performer')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerController {
  constructor(private readonly performerservice: PerformerService) {}
}
