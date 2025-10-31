import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

/**
 * Controlador de Autenticación
 * Maneja el inicio de sesión y validación del token JWT.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
    // Iniciar sesión
    // Valida las credenciales y genera un token JWT con rol, email e ID.
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión y obtener un JWT',
    description:
      'Autentica al usuario y retorna un token JWT junto a los datos del usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado correctamente',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          nombre: 'Juan Pérez',
          email: 'juan@correo.cl',
          rol: 'administrador',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  
    // Perfil del usuario autenticado
    // Retorna la información contenida en el token JWT (id, email, rol).
   
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:
      'Requiere un token JWT válido. Retorna los datos del usuario actual extraídos del payload del token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario autenticado',
    schema: {
      example: {
        id: 1,
        email: 'usuario@correo.cl',
        rol: 'guardia',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  getProfile(@Req() req) {
    return req.user;
  }


    // Verificar token
    // Endpoint opcional para validar un token JWT desde el front (Angular/Ionic).
   
  @Get('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verificar validez del token JWT',
    description:
      'Permite al frontend comprobar si el token actual sigue siendo válido (por ejemplo, al recargar la app).',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      example: { message: 'Token válido', user: { id: 2, rol: 'locatario' } },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  verifyToken(@Req() req) {
    return { message: 'Token válido', user: req.user };
  }
}
