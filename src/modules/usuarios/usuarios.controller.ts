import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Usuario,RolUsuario } from './usuarios.entity';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(JwtAuthGuard) // se aplica a todo el controlador
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Crear nuevo usuario (solo administradores)',
    description:
      'Crea un nuevo usuario con validaciones de RUT, email y contraseña segura. Solo accesible por rol administrador.',
  })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.', type: Usuario })
  @ApiResponse({ status: 409, description: 'Email o RUT ya existen.' })
  @ApiResponse({ status: 403, description: 'No autorizado para esta acción.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return await this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios activos',
    description: 'Devuelve una lista de usuarios activos. Requiere autenticación JWT.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios activos.', type: [Usuario] })
  async findAll(): Promise<Usuario[]> {
    return await this.usuariosService.findAll();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Devuelve los datos del usuario según el token JWT enviado.',
  })
  @ApiResponse({ status: 200, description: 'Datos del usuario autenticado.', type: Usuario })
  async getProfile(@Req() req): Promise<Usuario> {
    return await this.usuariosService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Devuelve la información pública del usuario según su ID.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID numérico del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: Usuario })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return await this.usuariosService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Actualizar usuario (solo administradores)',
    description:
      'Permite modificar datos del usuario incluyendo contraseña (se re-hashea automáticamente).',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.', type: Usuario })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 409, description: 'Email o RUT ya existen.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    return await this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Desactivar usuario (baja lógica, solo administradores)',
    description:
      'Desactiva el usuario cambiando el campo activo=false. El registro se mantiene para auditoría.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Usuario desactivado correctamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuariosService.remove(id);
  }
}
