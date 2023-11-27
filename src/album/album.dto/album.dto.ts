import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;
  @IsNotEmpty()
  @IsUrl()
  readonly caratula: string;
  @IsNotEmpty()
  @IsString()
  fechaLanzamiento;
  @IsNotEmpty()
  @IsString()
  readonly descripcion: string;
}
