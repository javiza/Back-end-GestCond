import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CerrarTurnoDto {
  @ApiProperty({
    example: 'Finalizo turno sin novedades, entrego llaves al supervisor.',
    description: 'Observación escrita por el guardia al finalizar su turno.',
  })
  @IsNotEmpty({ message: 'Debe registrar una observación de término.' })
  @IsString({ message: 'La observación de término debe ser texto.' })
  observacion_termino: string;
}
