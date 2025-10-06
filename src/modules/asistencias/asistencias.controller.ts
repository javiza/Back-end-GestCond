import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('asistencias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsistenciasController {
  constructor(private readonly service: AsistenciasService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateAsistenciaDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAsistenciaDto) { return this.service.update(+id, dto); }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
