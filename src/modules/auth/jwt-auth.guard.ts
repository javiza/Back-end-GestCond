import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


// Guard para proteger rutas con autenticación JWT.
// Se integra automáticamente con la estrategia 'jwt' definida en el AuthModule.

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
   // Método opcional para personalizar el manejo de errores JWT.
   // Permite interceptar tokens expirados o inválidos.

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      // Detecta errores comunes de expiración o formato
      const message =
        info?.message === 'jwt expired'
          ? 'El token ha expirado. Inicia sesión nuevamente.'
          : 'Token inválido o ausente. Acceso no autorizado.';

      throw new UnauthorizedException(message);
    }
    return user;
  }
}
