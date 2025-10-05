import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
