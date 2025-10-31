import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


 //DTO de autenticación de usuario.
  //Valida las credenciales enviadas en el login.
 
export class LoginDto {
  @ApiProperty({
    example: 'usuario@correo.cl',
    description: 'Correo electrónico registrado del usuario',
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido (ej: usuario@correo.cl)' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del usuario registrada en el sistema',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Debe incluir mayúscula, minúscula, número y símbolo',
  })
  password: string;
}
