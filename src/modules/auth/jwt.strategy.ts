import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


//  Interfaz del payload JWT que se espera del token.

export interface JwtPayload {
  sub: number;
  email: string;
  rol: 'administrador' | 'guardia' | 'locatario';
}


  // Estrategia JWT que valida los tokens firmados por AuthService.
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extrae el token desde Authorization: Bearer <token>
      ignoreExpiration: false, // NO ignorar expiración
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
  }

  
  //  Valida el payload del JWT.
  //  Si el token es válido, retorna el usuario que se agregará en req.user.
  
  async validate(payload: JwtPayload) {
    if (!payload?.sub || !payload?.email || !payload?.rol) {
      this.logger.warn('Token JWT inválido o incompleto recibido');
      throw new UnauthorizedException('Token inválido o incompleto');
    }

    // Opcional: validación extra de roles conocidos
    const rolesPermitidos = ['administrador', 'guardia', 'locatario'];
    if (!rolesPermitidos.includes(payload.rol)) {
      this.logger.warn(`Rol desconocido detectado en JWT: ${payload.rol}`);
      throw new UnauthorizedException('Rol no autorizado en el token');
    }

    // Datos seguros disponibles en req.user
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
