import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuditoriaService } from './auditoria.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Auditoría')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly service: AuditoriaService) {}

  //  GET /auditoria
  @Get()
  @Roles('administrador')
  @ApiOperation({ summary: 'Listar todos los registros de auditoría' })
  @ApiResponse({
    status: 200,
    description: 'Registros de auditoría listados correctamente.',
  })
  findAll() {
    return this.service.findAll();
  }

  //  GET /auditoria/tabla/:tabla
  @Get('tabla/:tabla')
  @Roles('administrador')
  @ApiOperation({ summary: 'Filtrar auditoría por tabla afectada' })
  @ApiParam({ name: 'tabla', example: 'registros_ingreso' })
  @ApiResponse({
    status: 200,
    description: 'Filtrado por tabla completado correctamente.',
  })
  findByTable(@Param('tabla') tabla: string) {
    return this.service.findByTable(tabla);
  }

  //  GET /auditoria/accion/:accion
  @Get('accion/:accion')
  @Roles('administrador')
  @ApiOperation({ summary: 'Filtrar auditoría por tipo de acción (INSERT, UPDATE, DELETE)' })
  @ApiParam({ name: 'accion', example: 'INSERT' })
  @ApiResponse({
    status: 200,
    description: 'Filtrado por acción completado correctamente.',
  })
  findByAction(@Param('accion') accion: string) {
    return this.service.findByAction(accion);
  }

  //  GET /auditoria/usuario/:id
  @Get('usuario/:id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Filtrar auditoría por usuario responsable' })
  @ApiParam({ name: 'id', example: 3 })
  @ApiResponse({
    status: 200,
    description: 'Filtrado por usuario completado correctamente.',
  })
  findByUser(@Param('id') id: number) {
    return this.service.findByUser(id);
  }
}
