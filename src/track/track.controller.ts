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
import { TrackEntity } from './track.entity/track.entity';
import { TrackService } from './track.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
  constructor(private readonly trackservice: TrackService) {}
}
