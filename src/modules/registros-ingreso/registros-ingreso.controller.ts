import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { RegistrosIngresosService } from './registros-ingreso.service';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('registros-ingresos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registros-ingresos')
export class RegistrosIngresosController {
  constructor(private service: RegistrosIngresosService) {}

  @Get()
  @Roles('guardia')
  @ApiOperation({ summary: 'Listar todas los registros' })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('guardia')
  @ApiOperation({ summary: 'Obtener un registro por id' })
  @ApiResponse({ status: 200, description: 'registro encontrado.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('guardia')
  @ApiOperation({ summary: 'Registrar una visita' })
  @ApiResponse({ status: 201, description: 'visita creada con éxito.' })
  create(@Body() dto: CreateRegistroIngresoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('guardia')
  @ApiOperation({ summary: 'Actualizar información de un registro' })
  update(@Param('id') id: number, @Body() dto: UpdateRegistroIngresoDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/salida')
  @Roles('guardia')
  @ApiOperation({ summary: 'Activar o desactivar un registro' })
  registrarSalida(@Param('id') id: number) {
    return this.service.registrarSalida(id);
  }

  @Delete(':id')
   @Roles('guardia')
  @ApiOperation({ summary: 'Eliminar un registro' })
  @ApiResponse({ status: 200, description: 'registro eliminado.' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
