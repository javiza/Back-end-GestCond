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
} from '@nestjs/swagger';

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear nuevo usuario (solo admin)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o RUT ya existen' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar usuarios activos' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios activos' })
  findAll() {
    return this.usuariosService.findAll(); // ya filtra por activo en el service
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Datos del usuario autenticado' })
  getProfile(@Req() req) {
    return this.usuariosService.findOne(req.user.id); // unificado con findOne
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  @ApiOperation({ summary: 'Desactivar usuario (baja lógica, solo admin)' })
  @ApiResponse({ status: 204, description: 'Usuario desactivado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuariosService.remove(id); 
  }
}
