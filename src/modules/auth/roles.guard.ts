import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

type Rol = 'administrador' | 'guardia' | 'locatario' ;

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Rol[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (!roles.includes(user.rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
