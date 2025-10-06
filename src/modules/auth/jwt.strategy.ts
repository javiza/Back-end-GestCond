import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: number;
  email: string;
  rol: 'administrador' | 'guardia' | 'locatario';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret', // lo agregue en caso de error borrar
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload?.sub || !payload?.email || !payload?.rol) {
      throw new UnauthorizedException('Token inválido o incompleto');
    }

    // Esto es lo que estará disponible en req.user
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
