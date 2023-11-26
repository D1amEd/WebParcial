import { IsNotEmpty, IsString, IsUrl, IsDate } from 'class-validator';
export class TrackDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;
    @IsNotEmpty()
    @IsString()
    readonly duracion: string;
    @IsNotEmpty()
    @IsString()
    readonly album: string;
}
