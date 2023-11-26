import { IsNotEmpty, IsString, IsUrl, IsDate } from 'class-validator';
export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;
  @IsNotEmpty()
  @IsUrl()
  readonly caratula: string;
  @IsNotEmpty()
  @IsDate()
  readonly fechaLanzamiento: Date;
  @IsNotEmpty()
  @IsString()
  readonly descripcion: string;
}
