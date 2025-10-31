import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../usuarios/usuarios.entity';


//  Guard de Roles:
//  Controla el acceso a rutas según el rol del usuario autenticado.
//   Utiliza metadatos definidos con el decorador @Roles().

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos definidos en el decorador @Roles()
    const rolesRequeridos = this.reflector.getAllAndOverride<RolUsuario[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no requiere roles específicos, se permite el acceso
    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Si no hay usuario en la request (token inválido o faltante)
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    // Verifica si el usuario tiene alguno de los roles permitidos
    const tieneRolPermitido = rolesRequeridos.includes(user.rol);

    if (!tieneRolPermitido) {
      throw new ForbiddenException(
        `Acceso denegado: se requiere rol ${rolesRequeridos.join(' o ')}`,
      );
    }

    return true;
  }
}
