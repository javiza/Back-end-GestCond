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

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  
  //  Valida las credenciales del usuario.
  //   Verifica email, estado activo y coincidencia del password.
  
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

  
    // Genera un token JWT con la información esencial del usuario.
    // Centralizado para permitir reutilización (e.g., recuperación, invitaciones).
  
  private generateToken(user: Usuario): string {
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '12h',
    });
  }

  
  //  Inicia sesión generando un token JWT seguro.
  //  Incluye el rol y el ID del usuario en el payload.
  
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const accessToken = this.generateToken(user);

    return {
      message: 'Inicio de sesión exitoso',
      access_token: accessToken,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  
  //  Verifica la validez de un token y devuelve su payload decodificado.
   
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
