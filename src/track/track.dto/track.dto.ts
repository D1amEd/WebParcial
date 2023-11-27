import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TrackDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;
  @IsNotEmpty()
  @IsNumber()
  readonly duracion: string;
}
