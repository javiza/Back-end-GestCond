import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsIn,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsRutChileno } from 'src/common/validators/rut.validator';
import { RolUsuario } from '../usuarios.entity';
export class CreateUsuarioDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: '12345678-9', description: 'RUT chileno válido con guion' })
  @IsNotEmpty()
  @IsRutChileno({ message: 'El RUT no es válido' })
  rut: string;

  @ApiProperty({ example: 'juan@correo.cl', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña segura (mínimo 8 caracteres)' })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'La contraseña debe contener mayúscula, minúscula, número y símbolo',
  })
  password: string;

  @ApiProperty({ example: 'administrador', enum: RolUsuario })
@IsEnum(RolUsuario, { message: 'El rol debe ser administrador o usuario' })
rol: RolUsuario;
}
