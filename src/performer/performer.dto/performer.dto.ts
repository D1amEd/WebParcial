import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class PerformerDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;
    @IsNotEmpty()
    @IsUrl()
    readonly imagen: string;
    @IsNotEmpty()
    @IsString()
    readonly descripcion: string;
}
