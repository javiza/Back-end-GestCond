import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RegistroIngresosAdminService } from './registro-ingresos-admin.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RegistroIngreso } from '../registros-ingreso/registro-ingreso.entity';
import { RolUsuario } from '../usuarios/usuarios.entity';


@ApiTags('Registros de Ingreso admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registro-ingresos-admin')
export class RegistroIngresosAdminController {
  constructor(private readonly service: RegistroIngresosAdminService) {}


  @Get('todas')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Listar todas las visitas registradas (modo completo)' })
  @ApiResponse({
    status: 200,
    description: 'Listado completo de todas las visitas registradas.',
    type: [RegistroIngreso],
  })
  async listarTodas() {
    return await this.service.listarTodasVisitas();
  }
}
