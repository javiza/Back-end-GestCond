import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, Length } from 'class-validator';

  //DTO para crear una nueva autorización mediante QR.
export class CrearAutorizacionDto {
  @ApiProperty({
    example: 'QR-ABCD1234',
    description: 'Código único del QR generado o validado para ingreso.',
  })
  @IsString({ message: 'El código QR debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El campo código_qr es obligatorio.' })
  @Length(3, 255, { message: 'El código QR debe tener entre 3 y 255 caracteres.' })
  codigo_qr: string;

  @ApiProperty({
    example: 'Delivery PedidosYa',
    required: false,
    description: 'Motivo o contexto de la autorización (opcional).',
  })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto.' })
  motivo?: string;

  @ApiProperty({
    example: 10,
    required: false,
    description: 'ID del usuario que autoriza el ingreso (opcional).',
  })
  @IsOptional()
  @IsInt({ message: 'El id_usuario debe ser un número entero.' })
  id_usuario?: number;
}
