import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { AutorizacionQRService } from './autorizacion_qr.service';
import { CrearAutorizacionDto } from './dto/create-autorizacion_qr.dto';
import { ValidarQRDto } from './dto/validar-qr.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';
  import { Get, Param } from '@nestjs/common'; 
import { Request } from '@nestjs/common';

@ApiTags('Autorización QR')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('autorizacion-qr')
export class AutorizacionQRController {
  constructor(private readonly service: AutorizacionQRService) {}


  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.LOCATARIO)
  @ApiOperation({
    summary: 'Crear una nueva autorización QR',
    description:
      'Genera un nuevo código QR asociado a un usuario (opcional). Emite evento Kafka `AUTORIZACION_CREADA`.',
  })
  @ApiBody({ type: CrearAutorizacionDto })
  @ApiResponse({ status: 201, description: 'Autorización creada exitosamente.' })
  crear(@Body() dto: CrearAutorizacionDto) {
    return this.service.crear(dto);
  }

  @Post('validar')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Validar o escanear un código QR',
    description:
      'Verifica si un código QR es válido. Si lo es, emite evento Kafka `AUTORIZACION_VALIDADA`; si no, `AUTORIZACION_RECHAZADA`.',
  })
  @ApiBody({ type: ValidarQRDto })
  @ApiResponse({ status: 200, description: 'QR válido, evento emitido.' })
  @ApiResponse({ status: 404, description: 'Código QR inexistente o inválido.' })
  validar(@Body() dto: ValidarQRDto) {
    return this.service.validarQR(dto);
 
  }



// Obtener todas las autorizaciones QR (todas las visitas registradas)
@Get()
@Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
@ApiOperation({
  summary: 'Listar todas las visitas registradas mediante códigos QR',
  description:
    'Devuelve todas las autorizaciones QR creadas en el sistema, incluyendo nombre de visita, motivo, usuario y fecha.',
})
@ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
findAll() {
  return this.service.findAll();
}
// Obtener las visitas QR creadas por un usuario específico
@Get('usuario/:id')
@Roles(RolUsuario.ADMINISTRADOR, RolUsuario.LOCATARIO)
@ApiOperation({
  summary: 'Listar visitas registradas por un usuario específico',
  description:
    'Devuelve todas las autorizaciones QR creadas por un usuario (locatario o administrador) determinado.',
})
@ApiResponse({ status: 200, description: 'Listado filtrado por usuario obtenido correctamente.' })
@ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
findByUsuario(@Param('id') id: number) {
  return this.service.findByUsuario(Number(id));
}
@Get('mis-autorizaciones')
@Roles(RolUsuario.ADMINISTRADOR, RolUsuario.LOCATARIO)
@ApiOperation({
  summary: 'Listar autorizaciones creadas por el usuario autenticado',
  description:
    'Devuelve todas las autorizaciones QR registradas por el usuario actual autenticado.',
})
@ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
@Get('mis-autorizaciones')
findMine(@Request() req) {
  console.log('🧩 Usuario autenticado:', req.user);
  const userId = req.user?.id;
  console.log('🧩 ID detectado:', userId);
  return this.service.findByUsuario(Number(userId));
}

}
