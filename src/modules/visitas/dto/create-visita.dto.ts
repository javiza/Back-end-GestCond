import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  IsInt,
  Length,
} from 'class-validator';

export class CreateVisitaDto {
  @ApiProperty({ example: 'Pedro Morales', description: 'Nombre del visitante' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nombre: string;

  @ApiProperty({ example: '12345678-9', description: 'RUT del visitante' })
  @IsNotEmpty()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, {
    message: 'El RUT debe tener formato válido, ej: 12345678-9',
  })
  rut: string;

  @ApiProperty({ example: 5, description: 'ID de la casa visitada' })
  @IsInt()
  id_casa: number;

  @ApiProperty({ example: 2, description: 'ID del locatario que autoriza la visita' })
  @IsInt()
  autorizado_por: number;

  @ApiProperty({
    example: 'QR-ABCD1234',
    description: 'Código QR único generado para la visita',
  })
  @IsNotEmpty()
  @IsString()
  codigo_qr: string;
}
