import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: number;
  email: string;
  rol: 'administrador' | 'guardia' | 'locatario';
  nombre: string;
  id_guardia?: number | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload?.sub || !payload?.email || !payload?.rol) {
      throw new UnauthorizedException('Token inválido o incompleto');
    }

    const rolesPermitidos = ['administrador', 'guardia', 'locatario'];
    if (!rolesPermitidos.includes(payload.rol)) {
      throw new UnauthorizedException('Rol no autorizado en el token');
    }

    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
      nombre: payload.nombre || 'Sin nombre',
      id_guardia: payload.id_guardia || null,
    };
  }
}
