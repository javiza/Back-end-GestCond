import { Controller, Get, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditoriaService } from './auditoria.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Auditoría')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly service: AuditoriaService) {}

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Listar todos los registros de auditoría (con filtros opcionales)' })
  @ApiResponse({ status: 200, description: 'Listado de auditorías obtenido exitosamente' })
  findAll(
    @Query('tabla') tabla?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.service.findAll({ tabla, desde, hasta });
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener un registro de auditoría por ID' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete('limpiar/:fecha')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar registros de auditoría anteriores a una fecha' })
  clear(@Param('fecha') fecha: string) {
    return this.service.clearOld(fecha);
  }
}
