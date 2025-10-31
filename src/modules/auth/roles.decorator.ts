import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from 'src/modules/usuarios/usuarios.entity';


//  Decorador personalizado para restringir acceso según roles.

//  Ejemplo
//   @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
//   async findAll() {...}
 
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
