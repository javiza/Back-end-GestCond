import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../usuarios/usuarios.entity';
import { Guardia } from '../guardias/guardia.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Usuario> {
    try {
      const user = await this.usuariosService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas: usuario no encontrado');
      }

      if (!user.activo) {
        throw new UnauthorizedException('El usuario está desactivado o bloqueado');
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Credenciales inválidas: contraseña incorrecta');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Error al validar credenciales');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    let idGuardia: number | null = null;
    let nombreGuardia: string | null = null;

    try {
      const guardia = await this.usuariosService.findGuardiaByUsuarioId(user.id);
      if (guardia) {
        idGuardia = guardia.id;
        nombreGuardia = guardia.nombre;
      }
    } catch {
      idGuardia = null;
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
      nombre: nombreGuardia || user.nombre,
      id_guardia: idGuardia,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '12h',
    });

    return {
      message: 'Inicio de sesión exitoso',
      access_token: accessToken,
      user: {
        id: user.id,
        id_guardia: idGuardia,
        nombre: nombreGuardia || user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
