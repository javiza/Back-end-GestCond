// src/modules/locatarios/dto/create-locatario.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches, IsInt, Min } from 'class-validator';

export class CreateLocatarioDto {
  @ApiProperty() @IsNotEmpty() nombre: string;

  @ApiProperty({ example: '12345678-9' })
  @IsNotEmpty()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/)
  rut: string;

  @ApiProperty() @IsEmail() email: string;

  @ApiProperty({ minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)
  password: string;

  @ApiProperty({ example: 1 })
  @IsInt() @Min(1)
  id_casa: number;
}
