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
import { AlbumEntity } from './album.entity/album.entity';
import { AlbumService } from './album.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
  constructor(private readonly albumservice: AlbumService) {}
}
